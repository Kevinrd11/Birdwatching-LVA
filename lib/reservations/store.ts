import { randomBytes, randomUUID } from 'crypto';
import { reservationConfig } from '@/data/reservations';
import type {
  ChangeLogEntry,
  CustomerDetails,
  PaymentMethod,
  PaymentRecord,
  PaymentStatus,
  PriceQuote,
  ReservationHold,
  ReservationRecord,
} from '@/types/reservation';
import { getSlotsForDate } from './availability';
import { calculatePrice } from './pricing';
import { normalizeCustomer, parseParticipants, validateCustomer, validateParticipants } from './validation';
import { sendReservationEmail } from './emails';

type CreateHoldInput = {
  date: string;
  experienceId: string;
  scheduleId: string;
  adults: number;
  children: number;
};

type CreateReservationInput = {
  holdToken: string;
  customer: Partial<CustomerDetails>;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  idempotencyKey?: string;
};

type StoreState = {
  holds: ReservationHold[];
  reservations: ReservationRecord[];
  payments: PaymentRecord[];
  changes: ChangeLogEntry[];
  idempotency: Map<string, string>;
};

const globalStore = globalThis as typeof globalThis & { __lvaReservationStore?: StoreState };

function getStore(): StoreState {
  if (!globalStore.__lvaReservationStore) {
    globalStore.__lvaReservationStore = {
      holds: [],
      reservations: [],
      payments: [],
      changes: [],
      idempotency: new Map(),
    };
  }
  return globalStore.__lvaReservationStore;
}

function nowIso(): string {
  return new Date().toISOString();
}

function writeChange(action: string, metadata?: Record<string, unknown>, reservationId?: string): void {
  getStore().changes.push({
    id: randomUUID(),
    reservationId,
    action,
    actor: 'system',
    metadata,
    createdAt: nowIso(),
  });
}

function generateReservationCode(date: string): string {
  const year = date.slice(0, 4);
  const token = randomBytes(4).toString('hex').toUpperCase().slice(0, 5);
  return `BIRD-${year}-${token}`;
}

export function releaseExpiredHolds(): number {
  const store = getStore();
  const now = new Date();
  let released = 0;

  store.holds = store.holds.map((hold) => {
    if (hold.status === 'active' && new Date(hold.expiresAt) <= now) {
      released += 1;
      return { ...hold, status: 'expired' };
    }
    return hold;
  });

  if (released) writeChange('holds.expired', { released });
  return released;
}

export function listReservations(): ReservationRecord[] {
  releaseExpiredHolds();
  return [...getStore().reservations];
}

export function listHolds(): ReservationHold[] {
  releaseExpiredHolds();
  return [...getStore().holds];
}

export function findReservationByCode(code: string): ReservationRecord | undefined {
  return getStore().reservations.find((reservation) => reservation.reservationCode === code.toUpperCase());
}

export function createHold(input: CreateHoldInput): ReservationHold {
  releaseExpiredHolds();
  const store = getStore();
  const participants = parseParticipants(input);
  const slots = getSlotsForDate({
    date: input.date,
    experienceId: input.experienceId,
    reservations: store.reservations,
    holds: store.holds,
  });
  const slot = slots.find((item) => item.scheduleId === input.scheduleId);

  if (!slot || slot.state === 'blocked' || slot.state === 'sold_out') {
    throw new Error('SCHEDULE_UNAVAILABLE');
  }

  const validation = validateParticipants(input.experienceId, participants, slot.available);
  if (!validation.ok) throw new Error(Object.values(validation.errors)[0] ?? 'INVALID_PARTICIPANTS');

  const now = new Date();
  const expiresAt = new Date(now.getTime() + reservationConfig.holdMinutes * 60 * 1000);
  const hold: ReservationHold = {
    id: randomUUID(),
    token: randomUUID(),
    date: input.date,
    experienceId: input.experienceId,
    scheduleId: input.scheduleId,
    adults: participants.adults,
    children: participants.children,
    totalParticipants: participants.adults + participants.children,
    expiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString(),
    status: 'active',
  };

  store.holds.push(hold);
  writeChange('hold.created', { holdId: hold.id, date: hold.date, scheduleId: hold.scheduleId });
  return hold;
}

export function calculateQuoteForHold(hold: ReservationHold, promoCode?: string): PriceQuote {
  return calculatePrice({
    experienceId: hold.experienceId,
    scheduleId: hold.scheduleId,
    date: hold.date,
    participants: { adults: hold.adults, children: hold.children },
    promoCode,
  });
}

export async function createReservation(input: CreateReservationInput): Promise<{ reservation: ReservationRecord; emailStatus: string }> {
  releaseExpiredHolds();
  const store = getStore();

  if (input.idempotencyKey) {
    const existingCode = store.idempotency.get(input.idempotencyKey);
    if (existingCode) {
      const existing = findReservationByCode(existingCode);
      if (existing) return { reservation: existing, emailStatus: 'Reserva existente devuelta por idempotencia.' };
    }
  }

  const hold = store.holds.find((item) => item.token === input.holdToken);
  if (!hold || hold.status !== 'active' || new Date(hold.expiresAt) <= new Date()) {
    throw new Error('HOLD_EXPIRED');
  }

  const slots = getSlotsForDate({
    date: hold.date,
    experienceId: hold.experienceId,
    reservations: store.reservations,
    holds: store.holds.filter((item) => item.id !== hold.id),
  });
  const slot = slots.find((item) => item.scheduleId === hold.scheduleId);
  if (!slot || slot.available < hold.totalParticipants) throw new Error('INSUFFICIENT_CAPACITY');

  const experience = reservationConfig.experiences.find((item) => item.id === hold.experienceId);
  if (!experience) throw new Error('EXPERIENCE_NOT_FOUND');

  const customer = normalizeCustomer(input.customer);
  const customerValidation = validateCustomer(customer);
  if (!customerValidation.ok) throw new Error(Object.values(customerValidation.errors)[0] ?? 'INVALID_CUSTOMER');

  const quote = calculateQuoteForHold(hold, input.promoCode || customer.promoCode);
  const createdAt = nowIso();
  let reservationCode = generateReservationCode(hold.date);
  while (findReservationByCode(reservationCode)) reservationCode = generateReservationCode(hold.date);

  const reservation: ReservationRecord = {
    id: randomUUID(),
    reservationCode,
    tourId: reservationConfig.tourId,
    tourSlug: reservationConfig.tourSlug,
    tourName: reservationConfig.tourName,
    packageId: experience.id,
    packageName: experience.name,
    date: hold.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    timezone: reservationConfig.timezone,
    adults: hold.adults,
    children: hold.children,
    totalParticipants: hold.totalParticipants,
    customerName: customer.fullName,
    customerEmail: customer.email,
    customerPhone: `${customer.countryCode} ${customer.phone}`.trim(),
    country: customer.country,
    preferredLanguage: customer.preferredLanguage,
    experienceLevel: customer.experienceLevel,
    ebirdUsername: customer.ebirdUsername,
    notes: customer.notes,
    specialRequirements: customer.specialRequirements,
    subtotal: quote.subtotal,
    discount: quote.discount,
    taxes: quote.taxes,
    total: quote.total,
    depositAmount: quote.depositAmount,
    paidAmount: 0,
    pendingAmount: quote.total,
    currency: quote.currency,
    paymentMethod: input.paymentMethod,
    paymentStatus: input.paymentMethod === 'manual_pending' ? 'manual_verification_pending' : 'pending',
    reservationStatus: input.paymentMethod === 'manual_pending' ? 'manual_verification_pending' : 'pending_payment',
    holdExpiresAt: hold.expiresAt,
    createdAt,
    updatedAt: createdAt,
  };

  hold.status = 'confirmed';
  store.reservations.push(reservation);
  if (input.idempotencyKey) store.idempotency.set(input.idempotencyKey, reservation.reservationCode);

  const email = await sendReservationEmail(
    input.paymentMethod === 'manual_pending' ? 'payment_pending' : 'reservation_received',
    reservation
  );
  writeChange('reservation.created', { reservationCode: reservation.reservationCode }, reservation.id);

  return { reservation, emailStatus: email.message };
}

export function initiatePayment(input: {
  reservationCode: string;
  method: PaymentMethod;
  amount?: number;
  transactionId?: string;
}): PaymentRecord {
  const store = getStore();
  const reservation = findReservationByCode(input.reservationCode);
  if (!reservation) throw new Error('RESERVATION_NOT_FOUND');

  const amount = Math.min(input.amount ?? reservation.depositAmount, reservation.total);
  const now = nowIso();
  const payment: PaymentRecord = {
    id: randomUUID(),
    reservationId: reservation.id,
    method: input.method,
    status: input.method === 'manual_pending' ? 'manual_verification_pending' : 'processing',
    transactionId: input.transactionId,
    paidAmount: input.method === 'manual_pending' ? 0 : amount,
    pendingAmount: reservation.total - (input.method === 'manual_pending' ? 0 : amount),
    currency: reservation.currency,
    createdAt: now,
    updatedAt: now,
  };

  store.payments.push(payment);
  reservation.paymentMethod = input.method;
  reservation.paymentStatus = payment.status;
  reservation.reservationStatus = input.method === 'manual_pending' ? 'manual_verification_pending' : 'pending_payment';
  reservation.updatedAt = now;
  writeChange('payment.initiated', { method: input.method, amount }, reservation.id);
  return payment;
}

export async function confirmPayment(input: {
  reservationCode: string;
  paymentId: string;
  approved: boolean;
  transactionId?: string;
}): Promise<ReservationRecord> {
  const store = getStore();
  const reservation = findReservationByCode(input.reservationCode);
  if (!reservation) throw new Error('RESERVATION_NOT_FOUND');

  const payment = store.payments.find((item) => item.id === input.paymentId && item.reservationId === reservation.id);
  if (!payment) throw new Error('PAYMENT_NOT_FOUND');

  const now = nowIso();
  payment.transactionId = input.transactionId ?? payment.transactionId ?? `LVA-${randomBytes(5).toString('hex').toUpperCase()}`;
  payment.updatedAt = now;

  if (!input.approved) {
    payment.status = 'failed';
    reservation.paymentStatus = 'failed';
    reservation.reservationStatus = 'pending_payment';
    reservation.updatedAt = now;
    writeChange('payment.failed', { paymentId: payment.id }, reservation.id);
    return reservation;
  }

  const paidAmount = Math.min(reservation.total, reservation.paidAmount + payment.paidAmount);
  const pendingAmount = Math.max(0, reservation.total - paidAmount);
  const paymentStatus: PaymentStatus = pendingAmount === 0 ? 'paid' : 'partially_paid';

  payment.status = paymentStatus;
  payment.paidAt = now;
  payment.pendingAmount = pendingAmount;
  reservation.transactionId = payment.transactionId;
  reservation.paidAmount = paidAmount;
  reservation.pendingAmount = pendingAmount;
  reservation.paymentStatus = paymentStatus;
  reservation.reservationStatus = paymentStatus === 'paid' ? 'paid' : 'partial_payment';
  reservation.updatedAt = now;

  await sendReservationEmail(paymentStatus === 'paid' ? 'payment_received' : 'reservation_confirmed', reservation);
  writeChange('payment.confirmed', { paymentId: payment.id, paidAmount }, reservation.id);
  return reservation;
}

export function cancelReservation(code: string): ReservationRecord {
  const reservation = findReservationByCode(code);
  if (!reservation) throw new Error('RESERVATION_NOT_FOUND');

  reservation.reservationStatus = 'cancelled';
  reservation.updatedAt = nowIso();
  writeChange('reservation.cancelled', { reservationCode: reservation.reservationCode }, reservation.id);
  return reservation;
}

export function getChangeHistory(): ChangeLogEntry[] {
  return [...getStore().changes];
}


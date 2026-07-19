export type AvailabilityState = 'available' | 'few_left' | 'sold_out' | 'unavailable' | 'blocked';

export type DifficultyLevel = 'Fácil' | 'Moderado' | 'Avanzado';

export type PricingMode = 'per_person' | 'private_group';

export type PaymentMethod =
  | 'paypal'
  | 'card'
  | 'sinpe'
  | 'bank_transfer'
  | 'manual_pending';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partially_paid'
  | 'manual_verification_pending';

export type ReservationStatus =
  | 'draft'
  | 'pending_payment'
  | 'held'
  | 'confirmed'
  | 'paid'
  | 'partial_payment'
  | 'manual_verification_pending'
  | 'cancelled'
  | 'expired'
  | 'refunded'
  | 'no_show'
  | 'completed';

export type ExperienceLevel =
  | 'first_time'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'bird_photographer';

export type PreferredLanguage = 'es' | 'en';

export type PaymentOption = 'full' | 'percentage_deposit' | 'fixed_deposit';

export type ReservationStepId =
  | 'date'
  | 'experience'
  | 'schedule'
  | 'participants'
  | 'customer'
  | 'payment'
  | 'confirmation';

export type ExperiencePricing = {
  mode: PricingMode;
  adult: number;
  child: number;
  fixedGroupPrice?: number;
  extraPersonPrice?: number;
  includedParticipants?: number;
  taxRate: number;
  currency: 'CRC' | 'USD';
  deposit: {
    option: PaymentOption;
    percentage?: number;
    fixedAmount?: number;
  };
};

export type ReservationExperience = {
  id: string;
  slug: string;
  packageId: string;
  name: string;
  shortDescription: string;
  image: string;
  durationMinutes: number;
  difficulty: DifficultyLevel;
  approximateTime: string;
  inclusions: string[];
  minParticipants: number;
  maxParticipants: number;
  capacity: number;
  fewLeftThreshold: number;
  pricing: ExperiencePricing;
  specialRules: string[];
  enabled: boolean;
};

export type ScheduleTemplate = {
  id: string;
  experienceId: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
  seasonIds?: string[];
  capacity?: number;
  guideCapacity?: number;
  enabled: boolean;
};

export type AvailabilityBlock = {
  id: string;
  date: string;
  reason: string;
  experienceId?: string;
  scheduleId?: string;
  fullDay?: boolean;
};

export type Season = {
  id: string;
  name: string;
  startsOn: string;
  endsOn: string;
  enabledExperienceIds?: string[];
  priceMultiplier?: number;
};

export type PriceOverride = {
  id: string;
  date: string;
  experienceId: string;
  adult?: number;
  child?: number;
  fixedGroupPrice?: number;
};

export type PromoCode = {
  code: string;
  label: string;
  type: 'percentage' | 'fixed';
  value: number;
  active: boolean;
  startsOn?: string;
  endsOn?: string;
  experienceIds?: string[];
  maxUses?: number;
};

export type GuideAvailability = {
  id: string;
  date: string;
  scheduleId?: string;
  experienceId?: string;
  guideCount: number;
  capacityPerGuide: number;
};

export type AvailabilitySlot = {
  scheduleId: string;
  experienceId: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  held: number;
  available: number;
  state: AvailabilityState;
  reason?: string;
};

export type DateExperienceAvailability = {
  experienceId: string;
  state: AvailabilityState;
  totalCapacity: number;
  available: number;
  slots: AvailabilitySlot[];
};

export type DateAvailability = {
  date: string;
  state: AvailabilityState;
  isToday: boolean;
  isPast: boolean;
  reason?: string;
  experiences: DateExperienceAvailability[];
};

export type MonthAvailabilityDay = {
  date: string;
  day: number;
  state: AvailabilityState;
  isToday: boolean;
  isPast: boolean;
  available: number;
  totalCapacity: number;
};

export type ParticipantSelection = {
  adults: number;
  children: number;
};

export type CustomerDetails = {
  fullName: string;
  email: string;
  emailConfirm: string;
  phone: string;
  countryCode: string;
  country: string;
  preferredLanguage: PreferredLanguage;
  experienceLevel: ExperienceLevel;
  notes?: string;
  specialRequirements?: string;
  ebirdUsername?: string;
  wantsChecklist?: boolean;
  wantsEbirdRegistration?: boolean;
  promoCode?: string;
  lodgingName?: string;
  transportMethod?: string;
  acceptedTerms: boolean;
  acceptedCancellation: boolean;
  acceptedPrivacy: boolean;
  acceptedSafety: boolean;
};

export type PriceQuote = {
  experienceId: string;
  date: string;
  scheduleId: string;
  adults: number;
  children: number;
  totalParticipants: number;
  adultPrice: number;
  childPrice: number;
  groupPrice: number;
  extras: number;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  depositAmount: number;
  pendingAmount: number;
  currency: 'CRC' | 'USD';
  promoCode?: string;
  promoLabel?: string;
};

export type ReservationHold = {
  id: string;
  token: string;
  date: string;
  experienceId: string;
  scheduleId: string;
  adults: number;
  children: number;
  totalParticipants: number;
  expiresAt: string;
  createdAt: string;
  status: 'active' | 'released' | 'confirmed' | 'expired';
};

export type PaymentRecord = {
  id: string;
  reservationId: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAmount: number;
  pendingAmount: number;
  paidAt?: string;
  currency: 'CRC' | 'USD';
  createdAt: string;
  updatedAt: string;
};

export type ReservationRecord = {
  id: string;
  reservationCode: string;
  tourId: string;
  tourSlug: string;
  tourName: string;
  packageId: string;
  packageName: string;
  date: string;
  startTime: string;
  endTime: string;
  timezone: string;
  adults: number;
  children: number;
  totalParticipants: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  country: string;
  preferredLanguage: PreferredLanguage;
  experienceLevel: ExperienceLevel;
  ebirdUsername?: string;
  notes?: string;
  specialRequirements?: string;
  subtotal: number;
  discount: number;
  taxes: number;
  total: number;
  depositAmount: number;
  paidAmount: number;
  pendingAmount: number;
  currency: 'CRC' | 'USD';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  reservationStatus: ReservationStatus;
  transactionId?: string;
  holdExpiresAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ChangeLogEntry = {
  id: string;
  reservationId?: string;
  action: string;
  actor: 'system' | 'customer' | 'admin';
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type EmailTemplateId =
  | 'reservation_received'
  | 'reservation_confirmed'
  | 'payment_received'
  | 'payment_pending'
  | 'reservation_cancelled'
  | 'tour_reminder'
  | 'refund_processed';

export type ReservationConfig = {
  timezone: string;
  tourId: string;
  tourSlug: string;
  tourName: string;
  holdMinutes: number;
  experiences: ReservationExperience[];
  scheduleTemplates: ScheduleTemplate[];
  blockedDates: AvailabilityBlock[];
  seasons: Season[];
  priceOverrides: PriceOverride[];
  promoCodes: PromoCode[];
  guideAvailability: GuideAvailability[];
};

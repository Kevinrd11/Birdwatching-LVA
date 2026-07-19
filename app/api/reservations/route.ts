import { createReservation } from '@/lib/reservations/store';
import { apiError, apiOk, mapDomainError, readJson } from '@/lib/reservations/http';
import { isPaymentMethod } from '@/lib/reservations/validation';
import type { CustomerDetails, PaymentMethod } from '@/types/reservation';

type ReservationRequest = {
  holdToken: string;
  customer: Partial<CustomerDetails>;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  idempotencyKey?: string;
};

export async function POST(request: Request) {
  const body = await readJson<ReservationRequest>(request);
  if (!body.holdToken) return apiError('La retención de cupos es requerida.', 400, 'MISSING_HOLD');
  if (!isPaymentMethod(body.paymentMethod)) return apiError('Seleccioná un método de pago válido.', 400, 'INVALID_PAYMENT_METHOD');

  try {
    return apiOk(await createReservation(body as ReservationRequest));
  } catch (error) {
    return mapDomainError(error);
  }
}


import { initiatePayment } from '@/lib/reservations/store';
import { apiError, apiOk, mapDomainError, readJson } from '@/lib/reservations/http';
import { isPaymentMethod } from '@/lib/reservations/validation';
import type { PaymentMethod } from '@/types/reservation';

type PaymentRequest = {
  reservationCode: string;
  method: PaymentMethod;
  amount?: number;
  transactionId?: string;
};

export async function POST(request: Request) {
  const body = await readJson<PaymentRequest>(request);
  if (!body.reservationCode) return apiError('Falta el código de reserva.', 400, 'MISSING_RESERVATION');
  if (!isPaymentMethod(body.method)) return apiError('Seleccioná un método de pago válido.', 400, 'INVALID_PAYMENT_METHOD');

  try {
    return apiOk({ payment: initiatePayment(body as PaymentRequest) });
  } catch (error) {
    return mapDomainError(error);
  }
}


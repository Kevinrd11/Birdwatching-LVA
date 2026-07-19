import { confirmPayment } from '@/lib/reservations/store';
import { apiError, apiOk, mapDomainError, readJson } from '@/lib/reservations/http';

type ConfirmPaymentRequest = {
  reservationCode: string;
  paymentId: string;
  approved: boolean;
  transactionId?: string;
};

export async function POST(request: Request) {
  const body = await readJson<ConfirmPaymentRequest>(request);
  if (!body.reservationCode || !body.paymentId) {
    return apiError('Faltan datos para confirmar el pago.', 400, 'INVALID_PAYMENT_CONFIRMATION');
  }

  try {
    return apiOk({ reservation: await confirmPayment(body as ConfirmPaymentRequest) });
  } catch (error) {
    return mapDomainError(error);
  }
}


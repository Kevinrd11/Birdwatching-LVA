import { sendReservationEmail } from '@/lib/reservations/emails';
import { apiError, apiOk, mapDomainError, readJson } from '@/lib/reservations/http';
import { findReservationByCode } from '@/lib/reservations/store';
import type { EmailTemplateId } from '@/types/reservation';

type EmailRequest = {
  reservationCode: string;
  templateId?: EmailTemplateId;
};

export async function POST(request: Request) {
  const body = await readJson<EmailRequest>(request);
  if (!body.reservationCode) return apiError('Falta el código de reserva.', 400, 'MISSING_RESERVATION');

  const reservation = findReservationByCode(body.reservationCode);
  if (!reservation) return mapDomainError(new Error('RESERVATION_NOT_FOUND'));

  return apiOk(await sendReservationEmail(body.templateId ?? 'reservation_confirmed', reservation));
}


import { apiOk, mapDomainError } from '@/lib/reservations/http';
import { findReservationByCode } from '@/lib/reservations/store';

export async function GET(_request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  const reservation = findReservationByCode(code);
  if (!reservation) return mapDomainError(new Error('RESERVATION_NOT_FOUND'));
  return apiOk({ reservation });
}


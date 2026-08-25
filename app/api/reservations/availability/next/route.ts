import { findNextAvailableDate } from '@/lib/reservations/availability';
import { isValidDateKey, todayKey } from '@/lib/reservations/dates';
import { apiError, apiOk } from '@/lib/reservations/http';
import { listHolds, listReservations } from '@/lib/reservations/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const from = url.searchParams.get('from') ?? todayKey();
  const experienceId = url.searchParams.get('experienceId') ?? undefined;
  if (!isValidDateKey(from)) return apiError('Indicá una fecha válida.', 400, 'INVALID_DATE');

  const next = findNextAvailableDate({
    from,
    experienceId,
    reservations: listReservations(),
    holds: listHolds(),
  });

  if (!next) return apiError('No encontramos fechas disponibles en los próximos meses.', 404, 'NO_DATES');
  return apiOk({ availability: next });
}

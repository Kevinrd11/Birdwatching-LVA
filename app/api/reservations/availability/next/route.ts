import { findNextAvailableDate } from '@/lib/reservations/availability';
import { isValidDateKey, todayKey } from '@/lib/reservations/dates';
import { apiError, apiOk } from '@/lib/reservations/http';
import { listHolds, listReservations } from '@/lib/reservations/store';

export async function GET(request: Request) {
  const from = new URL(request.url).searchParams.get('from') ?? todayKey();
  if (!isValidDateKey(from)) return apiError('Indicá una fecha válida.', 400, 'INVALID_DATE');

  const next = findNextAvailableDate({
    from,
    reservations: listReservations(),
    holds: listHolds(),
  });

  if (!next) return apiError('No encontramos fechas disponibles en los próximos meses.', 404, 'NO_DATES');
  return apiOk({ availability: next });
}


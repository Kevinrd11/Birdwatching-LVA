import { getDateAvailability } from '@/lib/reservations/availability';
import { isValidDateKey } from '@/lib/reservations/dates';
import { apiError, apiOk } from '@/lib/reservations/http';
import { listHolds, listReservations } from '@/lib/reservations/store';

export async function GET(request: Request) {
  const date = new URL(request.url).searchParams.get('date') ?? '';
  if (!isValidDateKey(date)) return apiError('Indicá una fecha válida.', 400, 'INVALID_DATE');

  return apiOk({
    availability: getDateAvailability({
      date,
      reservations: listReservations(),
      holds: listHolds(),
    }),
  });
}


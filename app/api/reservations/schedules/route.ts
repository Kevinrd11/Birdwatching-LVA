import { getSlotsForDate } from '@/lib/reservations/availability';
import { isValidDateKey } from '@/lib/reservations/dates';
import { apiError, apiOk } from '@/lib/reservations/http';
import { listHolds, listReservations } from '@/lib/reservations/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get('date') ?? '';
  const experienceId = url.searchParams.get('experienceId') ?? '';

  if (!isValidDateKey(date)) return apiError('Indicá una fecha válida.', 400, 'INVALID_DATE');
  if (!experienceId) return apiError('Seleccioná una experiencia.', 400, 'INVALID_EXPERIENCE');

  return apiOk({
    slots: getSlotsForDate({
      date,
      experienceId,
      reservations: listReservations(),
      holds: listHolds(),
    }),
  });
}


import { getMonthAvailability } from '@/lib/reservations/availability';
import { apiError, apiOk } from '@/lib/reservations/http';
import { listHolds, listReservations } from '@/lib/reservations/store';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const year = Number(url.searchParams.get('year'));
  const month = Number(url.searchParams.get('month'));
  const experienceId = url.searchParams.get('experienceId') ?? undefined;

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return apiError('Indicá un año y mes válidos.', 400, 'INVALID_MONTH');
  }

  return apiOk({
    year,
    month,
    days: getMonthAvailability({
      year,
      month,
      experienceId,
      reservations: listReservations(),
      holds: listHolds(),
    }),
  });
}

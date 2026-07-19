import { reservationConfig } from '@/data/reservations';
import { apiError, apiOk } from '@/lib/reservations/http';
import { getChangeHistory, listHolds, listReservations } from '@/lib/reservations/store';

function isAdmin(request: Request): boolean {
  const token = request.headers.get('x-admin-token');
  return Boolean(token && token === (process.env.RESERVATIONS_ADMIN_TOKEN ?? 'dev-admin-token'));
}

export async function GET(request: Request) {
  if (!isAdmin(request)) return apiError('Acceso administrativo no autorizado.', 401, 'UNAUTHORIZED');

  return apiOk({
    config: reservationConfig,
    reservations: listReservations(),
    holds: listHolds(),
    changeHistory: getChangeHistory(),
  });
}

export async function POST(request: Request) {
  if (!isAdmin(request)) return apiError('Acceso administrativo no autorizado.', 401, 'UNAUTHORIZED');

  return apiOk({
    message:
      'Estructura administrativa preparada. Con una base de datos, este endpoint debe persistir bloqueos, cupos manuales, horarios y reservas internas con auditoría.',
  });
}


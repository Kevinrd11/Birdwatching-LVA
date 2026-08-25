import { reservationConfig } from '@/data/reservations';
import { isAdminAccessConfigured, isAdminRequest } from '@/lib/reservations/admin';
import { apiError, apiOk } from '@/lib/reservations/http';
import { getChangeHistory, listHolds, listReservations } from '@/lib/reservations/store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!isAdminAccessConfigured()) {
    return apiError('El acceso administrativo todavía no está configurado.', 503, 'ADMIN_NOT_CONFIGURED');
  }
  if (!isAdminRequest(request)) return apiError('Acceso administrativo no autorizado.', 401, 'UNAUTHORIZED');

  return apiOk(
    {
      config: reservationConfig,
      reservations: listReservations(),
      holds: listHolds(),
      changeHistory: getChangeHistory(),
      persistence: 'memory' as const,
    },
    { headers: { 'Cache-Control': 'private, no-store, max-age=0' } }
  );
}

export async function POST(request: Request) {
  if (!isAdminAccessConfigured()) {
    return apiError('El acceso administrativo todavía no está configurado.', 503, 'ADMIN_NOT_CONFIGURED');
  }
  if (!isAdminRequest(request)) return apiError('Acceso administrativo no autorizado.', 401, 'UNAUTHORIZED');

  return apiOk({
    message:
      'Estructura administrativa preparada. Con una base de datos, este endpoint debe persistir bloqueos, cupos manuales, horarios y reservas internas con auditoría.',
  });
}

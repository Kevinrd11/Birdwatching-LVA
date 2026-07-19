import { apiOk, mapDomainError } from '@/lib/reservations/http';
import { cancelReservation } from '@/lib/reservations/store';

export async function POST(_request: Request, context: { params: Promise<{ code: string }> }) {
  const { code } = await context.params;
  try {
    return apiOk({ reservation: cancelReservation(code) });
  } catch (error) {
    return mapDomainError(error);
  }
}


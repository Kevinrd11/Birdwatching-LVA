import { apiOk } from '@/lib/reservations/http';
import { releaseExpiredHolds } from '@/lib/reservations/store';

export async function POST() {
  return apiOk({ released: releaseExpiredHolds() });
}


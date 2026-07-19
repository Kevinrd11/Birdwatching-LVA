import { reservationConfig } from '@/data/reservations';
import { apiOk } from '@/lib/reservations/http';

export async function GET() {
  return apiOk({ experiences: reservationConfig.experiences.filter((experience) => experience.enabled) });
}


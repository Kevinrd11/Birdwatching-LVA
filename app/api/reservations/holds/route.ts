import { createHold } from '@/lib/reservations/store';
import { apiOk, mapDomainError, readJson } from '@/lib/reservations/http';

type HoldRequest = {
  date: string;
  experienceId: string;
  scheduleId: string;
  adults: number;
  children: number;
};

export async function POST(request: Request) {
  const body = await readJson<HoldRequest>(request);
  try {
    return apiOk({ hold: createHold(body as HoldRequest) });
  } catch (error) {
    return mapDomainError(error);
  }
}


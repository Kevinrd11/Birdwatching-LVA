import { calculatePrice } from '@/lib/reservations/pricing';
import { apiError, apiOk, mapDomainError, readJson } from '@/lib/reservations/http';
import { parseParticipants } from '@/lib/reservations/validation';

type PriceRequest = {
  experienceId: string;
  scheduleId: string;
  date: string;
  adults: number;
  children: number;
  promoCode?: string;
};

export async function POST(request: Request) {
  const body = await readJson<PriceRequest>(request);
  if (!body.experienceId || !body.scheduleId || !body.date) {
    return apiError('Faltan datos para calcular el precio.', 400, 'INVALID_PRICE_REQUEST');
  }

  try {
    return apiOk({
      quote: calculatePrice({
        experienceId: body.experienceId,
        scheduleId: body.scheduleId,
        date: body.date,
        participants: parseParticipants(body),
        promoCode: body.promoCode,
      }),
    });
  } catch (error) {
    return mapDomainError(error);
  }
}


import { apiError, apiOk, readJson } from '@/lib/reservations/http';
import { validatePromoCode } from '@/lib/reservations/pricing';

type PromoRequest = {
  code: string;
  date: string;
  experienceId: string;
};

export async function POST(request: Request) {
  const body = await readJson<PromoRequest>(request);
  if (!body.code || !body.date || !body.experienceId) {
    return apiError('Ingresá el código y los datos de la reserva.', 400, 'INVALID_PROMO_REQUEST');
  }

  const result = validatePromoCode(body.code, body.date, body.experienceId);
  return result.valid ? apiOk(result) : apiError(result.message, 400, 'INVALID_PROMO');
}


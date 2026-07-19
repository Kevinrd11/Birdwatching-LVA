import { NextResponse } from 'next/server';

export function apiOk<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ ok: true, data }, init);
}

export function apiError(message: string, status = 400, code = 'REQUEST_ERROR'): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export async function readJson<T>(request: Request): Promise<Partial<T>> {
  try {
    return (await request.json()) as Partial<T>;
  } catch {
    return {};
  }
}

export function mapDomainError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : 'REQUEST_ERROR';
  const messages: Record<string, string> = {
    SCHEDULE_UNAVAILABLE: 'El horario seleccionado no está disponible.',
    HOLD_EXPIRED: 'La retención de cupos expiró. Seleccioná otro horario.',
    INSUFFICIENT_CAPACITY: 'No hay cupos suficientes para completar la reserva.',
    EXPERIENCE_NOT_FOUND: 'La experiencia seleccionada no existe.',
    RESERVATION_NOT_FOUND: 'No encontramos esa reserva.',
    PAYMENT_NOT_FOUND: 'No encontramos ese pago.',
  };

  return apiError(messages[message] ?? message, message === 'RESERVATION_NOT_FOUND' ? 404 : 400, message);
}


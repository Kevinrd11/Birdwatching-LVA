import { timingSafeEqual } from 'node:crypto';

const developmentToken = 'dev-admin-token';

export function isAdminAccessConfigured(): boolean {
  return Boolean(process.env.RESERVATIONS_ADMIN_TOKEN?.trim()) || process.env.NODE_ENV !== 'production';
}

export function isAdminRequest(request: Request): boolean {
  const expected = process.env.RESERVATIONS_ADMIN_TOKEN?.trim()
    || (process.env.NODE_ENV !== 'production' ? developmentToken : '');
  const supplied = request.headers.get('x-admin-token')?.trim() ?? '';

  if (!expected || !supplied) return false;

  const expectedBuffer = Buffer.from(expected);
  const suppliedBuffer = Buffer.from(supplied);
  if (expectedBuffer.length !== suppliedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, suppliedBuffer);
}

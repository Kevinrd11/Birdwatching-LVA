const baseUrl = process.env.RESERVATION_TEST_BASE ?? 'http://127.0.0.1:3000';

async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const payload = await response.json();
  if (!payload.ok) {
    throw new Error(`${path}: ${payload.error?.message ?? response.statusText}`);
  }
  return payload.data;
}

const next = await api('/api/reservations/availability/next');
const date = next.availability.date;
const availableExperience = next.availability.experiences.find((experience) => experience.available > 0);
if (!availableExperience) throw new Error('No hay experiencias disponibles para la próxima fecha.');

const schedules = await api(`/api/reservations/schedules?date=${date}&experienceId=${availableExperience.experienceId}`);
const slot = schedules.slots.find((item) => item.available > 0 && item.state !== 'blocked');
if (!slot) throw new Error('No hay horarios disponibles para la experiencia.');

const price = await api('/api/reservations/price', {
  method: 'POST',
  body: JSON.stringify({
    date,
    experienceId: availableExperience.experienceId,
    scheduleId: slot.scheduleId,
    adults: 1,
    children: 0,
    promoCode: 'BIRD10',
  }),
});
if (!price.quote.total || price.quote.total <= 0) throw new Error('El total calculado no es válido.');

const hold = await api('/api/reservations/holds', {
  method: 'POST',
  body: JSON.stringify({
    date,
    experienceId: availableExperience.experienceId,
    scheduleId: slot.scheduleId,
    adults: 1,
    children: 0,
  }),
});
if (!hold.hold.token) throw new Error('No se creó la retención.');

const reservation = await api('/api/reservations', {
  method: 'POST',
  body: JSON.stringify({
    holdToken: hold.hold.token,
    paymentMethod: 'card',
    promoCode: 'BIRD10',
    idempotencyKey: `test-${hold.hold.id}`,
    customer: {
      fullName: 'Cliente de Prueba',
      email: 'cliente.prueba@example.com',
      emailConfirm: 'cliente.prueba@example.com',
      phone: '84519537',
      countryCode: '+506',
      country: 'Costa Rica',
      preferredLanguage: 'es',
      experienceLevel: 'beginner',
      acceptedTerms: true,
      acceptedCancellation: true,
      acceptedPrivacy: true,
      acceptedSafety: true,
    },
  }),
});
if (!reservation.reservation.reservationCode?.startsWith('BIRD-')) throw new Error('El código de reserva no tiene el formato esperado.');

const payment = await api('/api/reservations/payment', {
  method: 'POST',
  body: JSON.stringify({
    reservationCode: reservation.reservation.reservationCode,
    method: 'card',
    amount: reservation.reservation.depositAmount,
  }),
});
if (!payment.payment.id) throw new Error('No se creó el pago.');

const confirmed = await api('/api/reservations/payment/confirm', {
  method: 'POST',
  body: JSON.stringify({
    reservationCode: reservation.reservation.reservationCode,
    paymentId: payment.payment.id,
    approved: true,
  }),
});
if (!['paid', 'partially_paid'].includes(confirmed.reservation.paymentStatus)) {
  throw new Error('El pago no quedó confirmado desde backend.');
}

const fetched = await api(`/api/reservations/${confirmed.reservation.reservationCode}`);
if (fetched.reservation.reservationCode !== confirmed.reservation.reservationCode) {
  throw new Error('No se pudo consultar la reserva creada.');
}

console.log(`Reserva de prueba creada: ${confirmed.reservation.reservationCode}`);

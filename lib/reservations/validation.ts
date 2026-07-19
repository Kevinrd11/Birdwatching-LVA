import { reservationConfig } from '@/data/reservations';
import type { CustomerDetails, ParticipantSelection, PaymentMethod } from '@/types/reservation';

export type ValidationResult = {
  ok: boolean;
  errors: Record<string, string>;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeText(value: unknown, maxLength = 240): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

export function parseParticipants(input: Partial<ParticipantSelection>): ParticipantSelection {
  return {
    adults: Math.max(0, Number.isFinite(Number(input.adults)) ? Math.floor(Number(input.adults)) : 0),
    children: Math.max(0, Number.isFinite(Number(input.children)) ? Math.floor(Number(input.children)) : 0),
  };
}

export function validateParticipants(experienceId: string, participants: ParticipantSelection, capacity: number): ValidationResult {
  const experience = reservationConfig.experiences.find((item) => item.id === experienceId);
  const errors: Record<string, string> = {};
  const total = participants.adults + participants.children;

  if (!experience) errors.experienceId = 'La experiencia seleccionada no existe.';
  if (participants.adults < 0 || participants.children < 0) errors.participants = 'La cantidad de participantes no puede ser negativa.';
  if (total <= 0) errors.participants = 'La reserva debe tener al menos una persona.';

  if (experience) {
    if (total < experience.minParticipants) {
      errors.participants = `Esta experiencia requiere al menos ${experience.minParticipants} participante(s).`;
    }
    if (total > experience.maxParticipants) {
      errors.participants = `Esta experiencia permite un máximo de ${experience.maxParticipants} participante(s).`;
    }
  }

  if (total > capacity) {
    errors.capacity = 'No hay cupos suficientes para esa cantidad de participantes.';
  }

  return { ok: Object.keys(errors).length === 0, errors };
}

export function normalizeCustomer(input: Partial<CustomerDetails>): CustomerDetails {
  return {
    fullName: sanitizeText(input.fullName, 120),
    email: sanitizeText(input.email, 160).toLowerCase(),
    emailConfirm: sanitizeText(input.emailConfirm, 160).toLowerCase(),
    phone: sanitizeText(input.phone, 40),
    countryCode: sanitizeText(input.countryCode, 12) || '+506',
    country: sanitizeText(input.country, 80),
    preferredLanguage: input.preferredLanguage === 'en' ? 'en' : 'es',
    experienceLevel: input.experienceLevel ?? 'first_time',
    notes: sanitizeText(input.notes, 800),
    specialRequirements: sanitizeText(input.specialRequirements, 800),
    ebirdUsername: sanitizeText(input.ebirdUsername, 80),
    wantsChecklist: Boolean(input.wantsChecklist),
    wantsEbirdRegistration: Boolean(input.wantsEbirdRegistration),
    promoCode: sanitizeText(input.promoCode, 40).toUpperCase(),
    lodgingName: sanitizeText(input.lodgingName, 120),
    transportMethod: sanitizeText(input.transportMethod, 120),
    acceptedTerms: Boolean(input.acceptedTerms),
    acceptedCancellation: Boolean(input.acceptedCancellation),
    acceptedPrivacy: Boolean(input.acceptedPrivacy),
    acceptedSafety: Boolean(input.acceptedSafety),
  };
}

export function validateCustomer(customer: CustomerDetails): ValidationResult {
  const errors: Record<string, string> = {};

  if (customer.fullName.length < 3) errors.fullName = 'Ingresá el nombre completo.';
  if (!emailPattern.test(customer.email)) errors.email = 'Ingresá un correo electrónico válido.';
  if (customer.email !== customer.emailConfirm) errors.emailConfirm = 'Los correos electrónicos no coinciden.';
  if (customer.phone.length < 7) errors.phone = 'Ingresá un teléfono válido.';
  if (!customer.country) errors.country = 'Indicá el país de residencia.';
  if (!customer.acceptedTerms) errors.acceptedTerms = 'Debés aceptar los términos y condiciones.';
  if (!customer.acceptedCancellation) errors.acceptedCancellation = 'Debés aceptar la política de cancelación.';
  if (!customer.acceptedPrivacy) errors.acceptedPrivacy = 'Debés aceptar la política de privacidad.';
  if (!customer.acceptedSafety) errors.acceptedSafety = 'Debés aceptar las recomendaciones de seguridad.';

  return { ok: Object.keys(errors).length === 0, errors };
}

export function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === 'paypal' || value === 'card' || value === 'sinpe' || value === 'bank_transfer' || value === 'manual_pending';
}


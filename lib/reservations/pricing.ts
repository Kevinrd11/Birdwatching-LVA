import { reservationConfig } from '@/data/reservations';
import type { ParticipantSelection, PriceQuote, PromoCode } from '@/types/reservation';
import { overlapsDateRange } from './dates';

function roundCurrency(value: number): number {
  return Math.max(0, Math.round(value));
}

function activeSeasonMultiplier(date: string): number {
  return reservationConfig.seasons
    .filter((season) => overlapsDateRange(date, season.startsOn, season.endsOn))
    .reduce((multiplier, season) => multiplier * (season.priceMultiplier ?? 1), 1);
}

function findPromo(code: string | undefined, date: string, experienceId: string): PromoCode | undefined {
  if (!code) return undefined;
  const normalized = code.trim().toUpperCase();

  return reservationConfig.promoCodes.find((promo) => {
    if (!promo.active || promo.code !== normalized) return false;
    if (promo.startsOn && date < promo.startsOn) return false;
    if (promo.endsOn && date > promo.endsOn) return false;
    if (promo.experienceIds && !promo.experienceIds.includes(experienceId)) return false;
    return true;
  });
}

export function validatePromoCode(code: string, date: string, experienceId: string): { valid: boolean; promo?: PromoCode; message: string } {
  const promo = findPromo(code, date, experienceId);
  if (!promo) return { valid: false, message: 'El código promocional no es válido para esta reserva.' };
  return { valid: true, promo, message: promo.label };
}

export function calculatePrice(input: {
  experienceId: string;
  scheduleId: string;
  date: string;
  participants: ParticipantSelection;
  promoCode?: string;
}): PriceQuote {
  const experience = reservationConfig.experiences.find((item) => item.id === input.experienceId);
  if (!experience) throw new Error('EXPERIENCE_NOT_FOUND');

  const override = reservationConfig.priceOverrides.find(
    (item) => item.date === input.date && item.experienceId === experience.id
  );
  const multiplier = activeSeasonMultiplier(input.date);
  const adultPrice = roundCurrency((override?.adult ?? experience.pricing.adult) * multiplier);
  const childPrice = roundCurrency((override?.child ?? experience.pricing.child) * multiplier);
  const fixedGroupPrice = roundCurrency((override?.fixedGroupPrice ?? experience.pricing.fixedGroupPrice ?? 0) * multiplier);
  const totalParticipants = input.participants.adults + input.participants.children;

  let groupPrice = 0;
  let subtotal = 0;

  if (experience.pricing.mode === 'private_group') {
    const includedParticipants = experience.pricing.includedParticipants ?? experience.maxParticipants;
    const extraParticipants = Math.max(0, totalParticipants - includedParticipants);
    groupPrice = fixedGroupPrice + extraParticipants * (experience.pricing.extraPersonPrice ?? 0);
    subtotal = groupPrice;
  } else {
    subtotal = input.participants.adults * adultPrice + input.participants.children * childPrice;
  }

  const promo = findPromo(input.promoCode, input.date, experience.id);
  const discount = promo
    ? promo.type === 'percentage'
      ? roundCurrency(subtotal * (promo.value / 100))
      : Math.min(subtotal, promo.value)
    : 0;
  const taxable = Math.max(0, subtotal - discount);
  const taxes = roundCurrency(taxable * experience.pricing.taxRate);
  const total = taxable + taxes;

  const depositAmount =
    experience.pricing.deposit.option === 'full'
      ? total
      : experience.pricing.deposit.option === 'fixed_deposit'
        ? Math.min(total, experience.pricing.deposit.fixedAmount ?? 0)
        : roundCurrency(total * (experience.pricing.deposit.percentage ?? 0));

  return {
    experienceId: experience.id,
    date: input.date,
    scheduleId: input.scheduleId,
    adults: input.participants.adults,
    children: input.participants.children,
    totalParticipants,
    adultPrice,
    childPrice,
    groupPrice,
    extras: 0,
    subtotal,
    discount,
    taxes,
    total,
    depositAmount,
    pendingAmount: total - depositAmount,
    currency: experience.pricing.currency,
    promoCode: promo?.code,
    promoLabel: promo?.label,
  };
}


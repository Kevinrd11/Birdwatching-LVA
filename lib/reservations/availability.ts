import { reservationConfig } from '@/data/reservations';
import type {
  AvailabilitySlot,
  AvailabilityState,
  DateAvailability,
  DateExperienceAvailability,
  MonthAvailabilityDay,
  ReservationHold,
  ReservationRecord,
  ReservationStatus,
} from '@/types/reservation';
import { addDays, dayOfWeek, isPastDate, monthDateKeys, todayKey } from './dates';

const capacityStatuses: ReservationStatus[] = [
  'pending_payment',
  'held',
  'confirmed',
  'paid',
  'partial_payment',
  'manual_verification_pending',
];

function statusFromAvailable(available: number, threshold: number): AvailabilityState {
  if (available <= 0) return 'sold_out';
  if (available <= threshold) return 'few_left';
  return 'available';
}

function combineStates(states: AvailabilityState[]): AvailabilityState {
  if (states.includes('available')) return 'available';
  if (states.includes('few_left')) return 'few_left';
  if (states.includes('sold_out')) return 'sold_out';
  if (states.includes('blocked')) return 'blocked';
  return 'unavailable';
}

export function isDateBlocked(date: string): { blocked: boolean; reason?: string } {
  const block = reservationConfig.blockedDates.find((item) => item.date === date && item.fullDay);
  return { blocked: Boolean(block), reason: block?.reason };
}

export function getSlotsForDate(input: {
  date: string;
  experienceId?: string;
  reservations: ReservationRecord[];
  holds: ReservationHold[];
  now?: Date;
}): AvailabilitySlot[] {
  const weekday = dayOfWeek(input.date);
  const now = input.now ?? new Date();
  const fullDayBlock = isDateBlocked(input.date);

  if (isPastDate(input.date) || fullDayBlock.blocked) return [];

  return reservationConfig.scheduleTemplates
    .filter((schedule) => schedule.enabled)
    .filter((schedule) => !input.experienceId || schedule.experienceId === input.experienceId)
    .filter((schedule) => schedule.daysOfWeek.includes(weekday))
    .map((schedule) => {
      const experience = reservationConfig.experiences.find((item) => item.id === schedule.experienceId);
      if (!experience || !experience.enabled) return null;

      const block = reservationConfig.blockedDates.find(
        (item) =>
          item.date === input.date &&
          (!item.experienceId || item.experienceId === schedule.experienceId) &&
          (!item.scheduleId || item.scheduleId === schedule.id)
      );
      const guideOverride = reservationConfig.guideAvailability.find(
        (item) =>
          item.date === input.date &&
          (!item.experienceId || item.experienceId === schedule.experienceId) &&
          (!item.scheduleId || item.scheduleId === schedule.id)
      );
      const guideCapacity = guideOverride ? guideOverride.guideCount * guideOverride.capacityPerGuide : schedule.guideCapacity;
      const capacity = Math.min(schedule.capacity ?? experience.capacity, guideCapacity ?? schedule.capacity ?? experience.capacity);
      const booked = input.reservations
        .filter(
          (reservation) =>
            reservation.date === input.date &&
            reservation.packageId === schedule.experienceId &&
            reservation.startTime === schedule.startTime &&
            capacityStatuses.includes(reservation.reservationStatus)
        )
        .reduce((total, reservation) => total + reservation.totalParticipants, 0);
      const held = input.holds
        .filter(
          (hold) =>
            hold.status === 'active' &&
            new Date(hold.expiresAt) > now &&
            hold.date === input.date &&
            hold.experienceId === schedule.experienceId &&
            hold.scheduleId === schedule.id
        )
        .reduce((total, hold) => total + hold.totalParticipants, 0);
      const available = Math.max(0, capacity - booked - held);
      const state = block ? 'blocked' : statusFromAvailable(available, experience.fewLeftThreshold);

      const availabilitySlot: AvailabilitySlot = {
        scheduleId: schedule.id,
        experienceId: schedule.experienceId,
        startTime: schedule.startTime,
        endTime: schedule.endTime,
        capacity,
        booked,
        held,
        available: block ? 0 : available,
        state,
        reason: block?.reason,
      };

      return availabilitySlot;
    })
    .filter((slot): slot is AvailabilitySlot => slot !== null);
}

export function getDateAvailability(input: {
  date: string;
  reservations: ReservationRecord[];
  holds: ReservationHold[];
  now?: Date;
}): DateAvailability {
  const fullDayBlock = isDateBlocked(input.date);
  const isPast = isPastDate(input.date);
  const slots = getSlotsForDate(input);

  const experiences: DateExperienceAvailability[] = reservationConfig.experiences
    .filter((experience) => experience.enabled)
    .map((experience) => {
      const experienceSlots = slots.filter((slot) => slot.experienceId === experience.id);
      const totalCapacity = experienceSlots.reduce((total, slot) => total + slot.capacity, 0);
      const available = experienceSlots.reduce((total, slot) => total + slot.available, 0);
      const state = experienceSlots.length ? combineStates(experienceSlots.map((slot) => slot.state)) : 'unavailable';

      return {
        experienceId: experience.id,
        state,
        totalCapacity,
        available,
        slots: experienceSlots,
      };
    });

  const state = fullDayBlock.blocked
    ? 'blocked'
    : isPast
      ? 'unavailable'
      : combineStates(experiences.map((experience) => experience.state));

  return {
    date: input.date,
    state,
    isToday: input.date === todayKey(),
    isPast,
    reason: fullDayBlock.reason,
    experiences,
  };
}

export function getMonthAvailability(input: {
  year: number;
  month: number;
  experienceId?: string;
  reservations: ReservationRecord[];
  holds: ReservationHold[];
}): MonthAvailabilityDay[] {
  return monthDateKeys(input.year, input.month).map((date) => {
    const availability = getDateAvailability({
      date,
      reservations: input.reservations,
      holds: input.holds,
    });
    const relevantExperiences = input.experienceId
      ? availability.experiences.filter((experience) => experience.experienceId === input.experienceId)
      : availability.experiences;
    const totalCapacity = relevantExperiences.reduce((total, experience) => total + experience.totalCapacity, 0);
    const available = relevantExperiences.reduce((total, experience) => total + experience.available, 0);
    const state = availability.isPast
      ? 'unavailable'
      : combineStates(relevantExperiences.map((experience) => experience.state));

    return {
      date,
      day: Number(date.slice(-2)),
      state,
      isToday: availability.isToday,
      isPast: availability.isPast,
      available,
      totalCapacity,
    };
  });
}

export function findNextAvailableDate(input: {
  from: string;
  experienceId?: string;
  reservations: ReservationRecord[];
  holds: ReservationHold[];
  maxDays?: number;
}): DateAvailability | null {
  const maxDays = input.maxDays ?? 365;

  for (let offset = 0; offset <= maxDays; offset += 1) {
    const date = addDays(input.from, offset);
    const availability = getDateAvailability({
      date,
      reservations: input.reservations,
      holds: input.holds,
    });
    const relevantState = input.experienceId
      ? availability.experiences.find((experience) => experience.experienceId === input.experienceId)?.state
      : availability.state;
    if (relevantState === 'available' || relevantState === 'few_left') return availability;
  }

  return null;
}

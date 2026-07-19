import { reservationConfig } from '@/data/reservations';

export function todayKey(timezone = reservationConfig.timezone): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value ?? '1970';
  const month = parts.find((part) => part.type === 'month')?.value ?? '01';
  const day = parts.find((part) => part.type === 'day')?.value ?? '01';

  return `${year}-${month}-${day}`;
}

export function isValidDateKey(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00-06:00`).getTime());
}

export function toDate(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00-06:00`);
}

export function dayOfWeek(dateKey: string): number {
  return toDate(dateKey).getUTCDay();
}

export function addDays(dateKey: string, days: number): string {
  const date = toDate(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function isPastDate(dateKey: string): boolean {
  return dateKey < todayKey();
}

export function monthDateKeys(year: number, month: number): string[] {
  const date = new Date(Date.UTC(year, month - 1, 1, 6));
  const keys: string[] = [];

  while (date.getUTCMonth() === month - 1) {
    keys.push(date.toISOString().slice(0, 10));
    date.setUTCDate(date.getUTCDate() + 1);
  }

  return keys;
}

export function overlapsDateRange(dateKey: string, startsOn: string, endsOn: string): boolean {
  return dateKey >= startsOn && dateKey <= endsOn;
}

export function addMinutesToTime(time: string, minutes: number): string {
  const [hour, minute] = time.split(':').map(Number);
  const totalMinutes = hour * 60 + minute + minutes;
  const nextHour = Math.floor(totalMinutes / 60) % 24;
  const nextMinute = totalMinutes % 60;
  return `${String(nextHour).padStart(2, '0')}:${String(nextMinute).padStart(2, '0')}`;
}

export function formatLongDate(dateKey: string, locale = 'es-CR'): string {
  return toDate(dateKey).toLocaleDateString(locale, {
    timeZone: reservationConfig.timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}


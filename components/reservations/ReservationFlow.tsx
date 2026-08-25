'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type {
  AvailabilitySlot,
  AvailabilityState,
  CustomerDetails,
  DateAvailability,
  MonthAvailabilityDay,
  ParticipantSelection,
  PaymentMethod,
  PriceQuote,
  ReservationExperience,
  ReservationHold,
  ReservationRecord,
  ReservationStepId,
} from '@/types/reservation';

type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

type StepDefinition = {
  id: ReservationStepId;
  label: string;
};

type DraftState = {
  step: ReservationStepId;
  selectedDate: string;
  selectedExperienceId: string;
  selectedScheduleId: string;
  participants: ParticipantSelection;
  customer: CustomerDetails;
};

const storageKey = 'lva-reservation-draft-v1';

const steps: StepDefinition[] = [
  { id: 'date', label: 'Fecha' },
  { id: 'experience', label: 'Experiencia' },
  { id: 'schedule', label: 'Horario' },
  { id: 'participants', label: 'Participantes' },
  { id: 'customer', label: 'Datos' },
  { id: 'payment', label: 'Pago' },
  { id: 'confirmation', label: 'Confirmación' },
];

const defaultCustomer: CustomerDetails = {
  fullName: '',
  email: '',
  emailConfirm: '',
  phone: '',
  countryCode: '+506',
  country: 'Costa Rica',
  preferredLanguage: 'es',
  experienceLevel: 'first_time',
  notes: '',
  specialRequirements: '',
  ebirdUsername: '',
  wantsChecklist: true,
  wantsEbirdRegistration: false,
  promoCode: '',
  lodgingName: '',
  transportMethod: '',
  acceptedTerms: false,
  acceptedCancellation: false,
  acceptedPrivacy: false,
  acceptedSafety: false,
};

const stateLabels: Record<AvailabilityState, string> = {
  available: 'Disponible',
  few_left: 'Pocas plazas',
  sold_out: 'Agotado',
  unavailable: 'No disponible',
  blocked: 'Fecha bloqueada',
};

const stateClasses: Record<AvailabilityState, string> = {
  available: 'border-emerald-400 bg-emerald-50 text-emerald-950',
  few_left: 'border-amber-400 bg-amber-50 text-amber-950',
  sold_out: 'border-slate-300 bg-slate-100 text-slate-500',
  unavailable: 'border-slate-200 bg-white text-slate-400',
  blocked: 'border-rose-300 bg-rose-50 text-rose-800',
};

const paymentMethods: { id: PaymentMethod; label: string; description: string }[] = [
  { id: 'card', label: 'Tarjeta', description: 'Pago seguro preparado para proveedor externo.' },
  { id: 'paypal', label: 'PayPal', description: 'Redirección preparada para integración PayPal.' },
  { id: 'sinpe', label: 'SINPE', description: 'Pago manual sujeto a verificación.' },
  { id: 'bank_transfer', label: 'Transferencia', description: 'Transferencia bancaria pendiente de verificación.' },
  { id: 'manual_pending', label: 'Solicitud manual', description: 'Enviaremos la solicitud para confirmación del equipo.' },
];

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function money(value: number, currency = 'CRC'): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function longDate(dateKey: string): string {
  if (!dateKey) return '';
  return parseDateKey(dateKey).toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function durationLabel(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins} min`;
  return mins ? `${hours} h ${mins} min` : `${hours} h`;
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.ok) throw new Error(payload.error.message);
  return payload.data;
}

function loadDraft(): DraftState | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved ? (JSON.parse(saved) as DraftState) : null;
  } catch {
    return null;
  }
}

function buildCalendarGrid(year: number, monthIndex: number): (string | null)[] {
  const first = new Date(year, monthIndex, 1);
  const startPadding = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const grid: (string | null)[] = Array.from({ length: startPadding }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    grid.push(formatDateKey(new Date(year, monthIndex, day)));
  }

  while (grid.length % 7 !== 0) grid.push(null);
  return grid;
}

type ReservationFlowProps = {
  initialExperienceId?: string;
};

export default function ReservationFlow({ initialExperienceId }: ReservationFlowProps) {
  const initialDate = new Date();
  const [step, setStep] = useState<ReservationStepId>('date');
  const [monthCursor, setMonthCursor] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
  const [experiences, setExperiences] = useState<ReservationExperience[]>([]);
  const [monthAvailability, setMonthAvailability] = useState<MonthAvailabilityDay[]>([]);
  const [dateAvailability, setDateAvailability] = useState<DateAvailability | null>(null);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExperienceId, setSelectedExperienceId] = useState(initialExperienceId ?? '');
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [participants, setParticipants] = useState<ParticipantSelection>({ adults: 1, children: 0 });
  const [customer, setCustomer] = useState<CustomerDetails>(defaultCustomer);
  const [quote, setQuote] = useState<PriceQuote | null>(null);
  const [hold, setHold] = useState<ReservationHold | null>(null);
  const [reservation, setReservation] = useState<ReservationRecord | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [payFull, setPayFull] = useState(false);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [holdSeconds, setHoldSeconds] = useState<number | null>(null);

  const selectedExperience = useMemo(
    () => experiences.find((experience) => experience.id === selectedExperienceId),
    [experiences, selectedExperienceId]
  );
  const displayedExperiences = useMemo(
    () =>
      initialExperienceId
        ? experiences.filter((experience) => experience.id === initialExperienceId)
        : experiences,
    [experiences, initialExperienceId]
  );
  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.scheduleId === selectedScheduleId),
    [slots, selectedScheduleId]
  );
  const calendarDays = useMemo(
    () => buildCalendarGrid(monthCursor.getFullYear(), monthCursor.getMonth()),
    [monthCursor]
  );
  const monthLabel = useMemo(
    () => monthCursor.toLocaleDateString('es-CR', { month: 'long', year: 'numeric' }),
    [monthCursor]
  );
  const maxReachableStep = useMemo(() => {
    if (reservation) return 6;
    if (hold) return 5;
    if (
      selectedScheduleId
      && customer.acceptedTerms
      && customer.acceptedCancellation
      && customer.acceptedPrivacy
      && customer.acceptedSafety
    ) return 5;
    if (selectedScheduleId) return 4;
    if (selectedDate && selectedExperienceId) return 2;
    if (selectedDate) return 1;
    return 0;
  }, [customer, hold, reservation, selectedDate, selectedExperienceId, selectedScheduleId]);

  useEffect(() => {
    const draft = loadDraft();
    if (!draft) return;
    const sameExperience = !initialExperienceId || draft.selectedExperienceId === initialExperienceId;
    const draftDate = sameExperience ? draft.selectedDate : '';
    setStep(draft.step === 'confirmation' || !sameExperience ? 'date' : draft.step);
    setSelectedDate(draftDate);
    setSelectedExperienceId(initialExperienceId ?? draft.selectedExperienceId);
    setSelectedScheduleId(sameExperience ? draft.selectedScheduleId : '');
    setParticipants(draft.participants);
    setCustomer({ ...defaultCustomer, ...draft.customer });
    if (draftDate) {
      const date = parseDateKey(draftDate);
      setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }, [initialExperienceId]);

  useEffect(() => {
    apiFetch<{ experiences: ReservationExperience[] }>('/api/reservations/experiences')
      .then((data) => setExperiences(data.experiences))
      .catch((apiError) => setError(apiError instanceof Error ? apiError.message : 'No se pudieron cargar las experiencias.'));
  }, []);

  useEffect(() => {
    const year = monthCursor.getFullYear();
    const month = monthCursor.getMonth() + 1;
    setLoading('availability-month');
    const experienceQuery = initialExperienceId ? `&experienceId=${encodeURIComponent(initialExperienceId)}` : '';
    apiFetch<{ days: MonthAvailabilityDay[] }>(
      `/api/reservations/availability/month?year=${year}&month=${month}${experienceQuery}`
    )
      .then((data) => setMonthAvailability(data.days))
      .catch((apiError) => setError(apiError instanceof Error ? apiError.message : 'No se pudo cargar el calendario.'))
      .finally(() => setLoading(''));
  }, [initialExperienceId, monthCursor]);

  useEffect(() => {
    if (!selectedDate) return;
    apiFetch<{ availability: DateAvailability }>(`/api/reservations/availability/date?date=${selectedDate}`)
      .then((data) => setDateAvailability(data.availability))
      .catch((apiError) => setError(apiError instanceof Error ? apiError.message : 'No se pudo validar la fecha.'));
  }, [selectedDate]);

  useEffect(() => {
    if (!selectedDate || !selectedExperienceId) return;
    setLoading('schedules');
    apiFetch<{ slots: AvailabilitySlot[] }>(
      `/api/reservations/schedules?date=${selectedDate}&experienceId=${selectedExperienceId}`
    )
      .then((data) => setSlots(data.slots))
      .catch((apiError) => setError(apiError instanceof Error ? apiError.message : 'No se pudieron cargar los horarios.'))
      .finally(() => setLoading(''));
  }, [selectedDate, selectedExperienceId]);

  useEffect(() => {
    if (!selectedDate || !selectedExperienceId || !selectedScheduleId) {
      setQuote(null);
      return;
    }

    apiFetch<{ quote: PriceQuote }>('/api/reservations/price', {
      method: 'POST',
      body: JSON.stringify({
        date: selectedDate,
        experienceId: selectedExperienceId,
        scheduleId: selectedScheduleId,
        adults: participants.adults,
        children: participants.children,
        promoCode: customer.promoCode,
      }),
    })
      .then((data) => setQuote(data.quote))
      .catch(() => setQuote(null));
  }, [customer.promoCode, participants.adults, participants.children, selectedDate, selectedExperienceId, selectedScheduleId]);

  useEffect(() => {
    if (step === 'confirmation') return;
    const draft: DraftState = {
      step,
      selectedDate,
      selectedExperienceId,
      selectedScheduleId,
      participants,
      customer,
    };
    window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [customer, participants, selectedDate, selectedExperienceId, selectedScheduleId, step]);

  useEffect(() => {
    if (!hold || hold.status !== 'active') {
      setHoldSeconds(null);
      return;
    }

    const update = () => {
      const remaining = Math.max(0, Math.floor((new Date(hold.expiresAt).getTime() - Date.now()) / 1000));
      setHoldSeconds(remaining);
      if (remaining <= 120 && remaining > 0) {
        setNotice('Tu retención de cupos está por expirar. Completá el pago para confirmar la reserva.');
      }
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [hold]);

  const resetAfterDate = useCallback(() => {
    setSelectedExperienceId(initialExperienceId ?? '');
    setSelectedScheduleId('');
    setSlots([]);
    setHold(null);
    setReservation(null);
  }, [initialExperienceId]);

  const selectDate = async (date: string, day?: MonthAvailabilityDay) => {
    if (day?.isPast || day?.state === 'blocked' || day?.state === 'sold_out' || day?.state === 'unavailable') return;
    setError('');
    setSelectedDate(date);
    resetAfterDate();
    setLoading('date');
    try {
      const data = await apiFetch<{ availability: DateAvailability }>(`/api/reservations/availability/date?date=${date}`);
      setDateAvailability(data.availability);
      setStep('experience');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Fecha no disponible.');
    } finally {
      setLoading('');
    }
  };

  const findNextDate = async () => {
    setError('');
    setLoading('next-date');
    try {
      const from = selectedDate || formatDateKey(new Date());
      const experienceQuery = initialExperienceId
        ? `&experienceId=${encodeURIComponent(initialExperienceId)}`
        : '';
      const data = await apiFetch<{ availability: DateAvailability }>(
        `/api/reservations/availability/next?from=${from}${experienceQuery}`
      );
      const date = parseDateKey(data.availability.date);
      setMonthCursor(new Date(date.getFullYear(), date.getMonth(), 1));
      setSelectedDate(data.availability.date);
      setDateAvailability(data.availability);
      resetAfterDate();
      setStep('experience');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'No encontramos fechas disponibles.');
    } finally {
      setLoading('');
    }
  };

  const changeParticipants = (field: keyof ParticipantSelection, delta: number) => {
    setParticipants((current) => {
      const next = { ...current, [field]: Math.max(0, current[field] + delta) };
      const capacity = selectedSlot?.available ?? selectedExperience?.capacity ?? 1;
      const total = next.adults + next.children;
      if (total > capacity) return current;
      return next;
    });
  };

  const validateCustomerStep = (): boolean => {
    if (customer.fullName.trim().length < 3) return setError('Ingresá el nombre completo.'), false;
    if (!customer.email.includes('@')) return setError('Ingresá un correo electrónico válido.'), false;
    if (customer.email !== customer.emailConfirm) return setError('Los correos electrónicos no coinciden.'), false;
    if (customer.phone.trim().length < 7) return setError('Ingresá un teléfono válido.'), false;
    if (!customer.country.trim()) return setError('Indicá el país de residencia.'), false;
    if (!customer.acceptedTerms || !customer.acceptedCancellation || !customer.acceptedPrivacy || !customer.acceptedSafety) {
      return setError('Aceptá las políticas obligatorias para continuar.'), false;
    }
    setError('');
    return true;
  };

  const createPaymentHold = async () => {
    if (!selectedDate || !selectedExperienceId || !selectedScheduleId || !selectedSlot) {
      setError('Completá fecha, experiencia y horario antes de continuar.');
      return;
    }
    if (!validateCustomerStep()) return;

    setLoading('hold');
    setError('');
    try {
      const availability = await apiFetch<{ availability: DateAvailability }>(
        `/api/reservations/availability/date?date=${selectedDate}`
      );
      const slot = availability.availability.experiences
        .flatMap((experience) => experience.slots)
        .find((item) => item.scheduleId === selectedScheduleId);
      if (!slot || slot.available < participants.adults + participants.children) {
        setError('La disponibilidad cambió. Seleccioná otro horario.');
        setStep('schedule');
        return;
      }

      const data = await apiFetch<{ hold: ReservationHold }>('/api/reservations/holds', {
        method: 'POST',
        body: JSON.stringify({
          date: selectedDate,
          experienceId: selectedExperienceId,
          scheduleId: selectedScheduleId,
          adults: participants.adults,
          children: participants.children,
        }),
      });
      setHold(data.hold);
      setStep('payment');
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'No se pudo crear la retención de cupos.');
    } finally {
      setLoading('');
    }
  };

  const submitPayment = async () => {
    if (!hold || !quote) {
      setError('La retención de cupos no está activa.');
      return;
    }
    if (holdSeconds === 0) {
      setError('La retención expiró. Seleccioná nuevamente el horario.');
      setStep('schedule');
      return;
    }

    setLoading('payment');
    setError('');
    try {
      const reservationData = await apiFetch<{ reservation: ReservationRecord; emailStatus: string }>('/api/reservations', {
        method: 'POST',
        body: JSON.stringify({
          holdToken: hold.token,
          customer,
          paymentMethod,
          promoCode: customer.promoCode,
          idempotencyKey: `${hold.id}-${customer.email}`,
        }),
      });
      let finalReservation = reservationData.reservation;

      if (paymentMethod !== 'manual_pending') {
        const amount = payFull ? quote.total : quote.depositAmount;
        const paymentData = await apiFetch<{ payment: { id: string } }>('/api/reservations/payment', {
          method: 'POST',
          body: JSON.stringify({
            reservationCode: finalReservation.reservationCode,
            method: paymentMethod,
            amount,
          }),
        });
        const confirmed = await apiFetch<{ reservation: ReservationRecord }>('/api/reservations/payment/confirm', {
          method: 'POST',
          body: JSON.stringify({
            reservationCode: finalReservation.reservationCode,
            paymentId: paymentData.payment.id,
            approved: true,
          }),
        });
        finalReservation = confirmed.reservation;
      }

      setReservation(finalReservation);
      setStep('confirmation');
      window.localStorage.removeItem(storageKey);
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'No se pudo completar la reserva.');
    } finally {
      setLoading('');
    }
  };

  const canGoToStep = (targetStep: ReservationStepId): boolean => {
    const index = steps.findIndex((item) => item.id === targetStep);
    return index <= maxReachableStep;
  };

  const goToStep = (targetStep: ReservationStepId) => {
    if (canGoToStep(targetStep)) setStep(targetStep);
  };

  const dayMap = useMemo(
    () => new Map(monthAvailability.map((day) => [day.date, day])),
    [monthAvailability]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section className="overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white shadow-2xl shadow-emerald-950/10">
          <div className="border-b border-emerald-950/10 bg-[#07180f] px-4 py-5 text-white sm:px-6">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Sistema de reservas</p>
            <h1 className="mt-2 font-serif text-3xl font-black tracking-tight sm:text-4xl">
              {initialExperienceId && selectedExperience
                ? `Reservá ${selectedExperience.name}`
                : 'Reservá tu tour de avistamiento de aves'}
            </h1>
          </div>

          <div className="border-b border-emerald-950/10 bg-[#f8f3e8] px-4 py-4 sm:px-6">
            <ol className="flex gap-2 overflow-x-auto pb-1" aria-label="Progreso de reserva">
              {steps.map((item, index) => {
                const active = item.id === step;
                const complete = index < steps.findIndex((candidate) => candidate.id === step);
                const enabled = canGoToStep(item.id);
                return (
                  <li key={item.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => goToStep(item.id)}
                      disabled={!enabled}
                      className={`rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.12em] transition ${
                        active
                          ? 'border-emerald-950 bg-emerald-950 text-white'
                          : complete
                            ? 'border-emerald-300 bg-emerald-100 text-emerald-950'
                            : 'border-slate-200 bg-white text-slate-500 disabled:cursor-not-allowed disabled:opacity-55'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="p-4 sm:p-6">
            {initialExperienceId && selectedExperience && step === 'date' && (
              <article className="mb-6 overflow-hidden rounded-[1.5rem] border border-emerald-950/10 bg-[#f8f3e8] sm:grid sm:grid-cols-[13rem_1fr]">
                <div className="relative min-h-48 bg-emerald-950 sm:min-h-full">
                  <Image
                    src={selectedExperience.image}
                    alt={`Naturaleza durante ${selectedExperience.name}`}
                    fill
                    loading="eager"
                    sizes="(max-width: 640px) 100vw, 208px"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-emerald-700">Experiencia seleccionada</p>
                  <h2 className="mt-2 font-serif text-2xl font-black text-emerald-950">{selectedExperience.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{selectedExperience.shortDescription}</p>
                  <dl className="mt-4 grid grid-cols-2 gap-2 text-sm lg:grid-cols-4">
                    <Info label="Duración" value={durationLabel(selectedExperience.durationMinutes)} />
                    <Info label="Dificultad" value={selectedExperience.difficulty} />
                    <Info label="Momento" value={selectedExperience.approximateTime} />
                    <Info
                      label="Precio"
                      value={
                        selectedExperience.pricing.mode === 'private_group'
                          ? money(selectedExperience.pricing.fixedGroupPrice ?? 0, selectedExperience.pricing.currency)
                          : money(selectedExperience.pricing.adult, selectedExperience.pricing.currency)
                      }
                    />
                  </dl>
                </div>
              </article>
            )}
            {error && (
              <div role="alert" className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-800">
                {error}
              </div>
            )}
            {notice && (
              <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                {notice}
              </div>
            )}

            {step === 'date' && (
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-black text-emerald-950">Seleccioná una fecha</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {initialExperienceId
                        ? 'Mostramos únicamente fechas disponibles para esta experiencia.'
                        : 'El calendario se valida nuevamente contra el servidor al seleccionar.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={findNextDate}
                    className="rounded-full bg-emerald-950 px-4 py-3 text-sm font-black text-white"
                  >
                    {loading === 'next-date' ? 'Buscando...' : 'Buscar próxima fecha disponible'}
                  </button>
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-emerald-950/10 bg-[#f8f3e8] p-3 sm:p-5">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setMonthCursor((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}
                      className="grid h-11 w-11 place-items-center rounded-full border border-emerald-950/10 bg-white font-black text-emerald-950"
                      aria-label="Mes anterior"
                    >
                      ‹
                    </button>
                    <h3 className="text-center font-serif text-2xl font-black capitalize text-emerald-950">{monthLabel}</h3>
                    <button
                      type="button"
                      onClick={() => setMonthCursor((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}
                      className="grid h-11 w-11 place-items-center rounded-full border border-emerald-950/10 bg-white font-black text-emerald-950"
                      aria-label="Mes siguiente"
                    >
                      ›
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-black uppercase text-slate-500">
                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((day, index) => (
                      <span key={`${day}-${index}`}>{day}</span>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                      if (!date) return <span key={`empty-${index}`} className="aspect-square" />;
                      const day = dayMap.get(date);
                      const state = day?.state ?? 'unavailable';
                      const selected = date === selectedDate;
                      const disabled = !day || day.isPast || state === 'blocked' || state === 'sold_out' || state === 'unavailable';
                      return (
                        <button
                          type="button"
                          key={date}
                          onClick={() => selectDate(date, day)}
                          disabled={disabled}
                          className={`relative aspect-square rounded-2xl border p-1 text-sm font-black transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 disabled:cursor-not-allowed ${
                            selected ? 'border-emerald-950 bg-emerald-950 text-white' : stateClasses[state]
                          } ${day?.isToday && !selected ? 'ring-2 ring-amber-300' : ''}`}
                          aria-label={`${date}: ${stateLabels[state]}${day?.isToday ? ', fecha actual' : ''}`}
                        >
                          <span>{Number(date.slice(-2))}</span>
                          {!disabled && (
                            <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-current" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 grid gap-2 sm:grid-cols-3">
                  {Object.entries(stateLabels).map(([state, label]) => (
                    <span key={state} className={`rounded-full border px-3 py-2 text-xs font-bold ${stateClasses[state as AvailabilityState]}`}>
                      {label}
                    </span>
                  ))}
                  <span className="rounded-full border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900">Fecha actual</span>
                  <span className="rounded-full border border-emerald-950 bg-emerald-950 px-3 py-2 text-xs font-bold text-white">Seleccionada</span>
                </div>
              </div>
            )}

            {step === 'experience' && (
              <div>
                <StepHeader
                  title={initialExperienceId ? 'Tu experiencia seleccionada' : 'Elegí una experiencia'}
                  description={`Fecha seleccionada: ${longDate(selectedDate)}`}
                />
                <div className={`mt-6 grid gap-4 ${initialExperienceId ? 'grid-cols-1' : 'lg:grid-cols-3'}`}>
                  {displayedExperiences.map((experience) => {
                    const availability = dateAvailability?.experiences.find((item) => item.experienceId === experience.id);
                    const selectable = availability?.state === 'available' || availability?.state === 'few_left';
                    const selected = selectedExperienceId === experience.id;
                    return (
                      <article
                        key={experience.id}
                        className={`overflow-hidden rounded-[1.5rem] border bg-white shadow-xl shadow-emerald-950/5 ${
                          selected ? 'border-emerald-900 ring-4 ring-emerald-100' : 'border-emerald-950/10'
                        }`}
                      >
                        <div className={`relative bg-emerald-950 ${initialExperienceId ? 'h-56 sm:h-72' : 'h-44'}`}>
                          <Image
                            src={experience.image}
                            alt={`Naturaleza durante ${experience.name}`}
                            fill
                            sizes={initialExperienceId ? '(max-width: 1280px) 100vw, 900px' : '(max-width: 1024px) 100vw, 33vw'}
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-serif text-2xl font-black text-emerald-950">{experience.name}</h3>
                            <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${stateClasses[availability?.state ?? 'unavailable']}`}>
                              {availability ? `${availability.available} cupos` : 'Sin cupos'}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">{experience.shortDescription}</p>
                          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
                            <Info label="Duración" value={durationLabel(experience.durationMinutes)} />
                            <Info label="Dificultad" value={experience.difficulty} />
                            <Info label="Horario" value={experience.approximateTime} />
                            <Info
                              label="Precio"
                              value={
                                experience.pricing.mode === 'private_group'
                                  ? money(experience.pricing.fixedGroupPrice ?? 0, experience.pricing.currency)
                                  : money(experience.pricing.adult, experience.pricing.currency)
                              }
                            />
                          </dl>
                          <ul className="mt-4 space-y-2 text-sm text-slate-700">
                            {experience.inclusions.map((item) => (
                              <li key={item} className="flex gap-2">
                                <span className="font-black text-emerald-700" aria-hidden="true">✓</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                          {initialExperienceId && experience.specialRules.length > 0 && (
                            <div className="mt-4 rounded-2xl bg-[#f8f3e8] p-4 text-sm leading-6 text-emerald-950">
                              <p className="font-black">Información importante</p>
                              {experience.specialRules.map((rule) => (
                                <p key={rule} className="mt-1">{rule}</p>
                              ))}
                            </div>
                          )}
                          <button
                            type="button"
                            disabled={!selectable}
                            onClick={() => {
                              setSelectedExperienceId(experience.id);
                              setSelectedScheduleId('');
                              setHold(null);
                              setStep('schedule');
                            }}
                            className="mt-5 w-full rounded-full bg-emerald-950 px-4 py-3 text-sm font-black text-white disabled:bg-slate-200 disabled:text-slate-500"
                          >
                            {selectable
                              ? initialExperienceId
                                ? 'Continuar con esta experiencia'
                                : 'Seleccionar experiencia'
                              : 'No disponible en esta fecha'}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 'schedule' && (
              <div>
                <StepHeader title="Seleccioná un horario" description={`${selectedExperience?.name ?? ''} · ${longDate(selectedDate)}`} />
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {slots.map((slot) => {
                    const disabled = slot.state === 'blocked' || slot.state === 'sold_out';
                    const selected = slot.scheduleId === selectedScheduleId;
                    return (
                      <button
                        key={slot.scheduleId}
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          setSelectedScheduleId(slot.scheduleId);
                          setHold(null);
                          setStep('participants');
                        }}
                        className={`rounded-[1.5rem] border p-4 text-left transition disabled:cursor-not-allowed ${
                          selected ? 'border-emerald-950 bg-emerald-950 text-white' : `${stateClasses[slot.state]} hover:-translate-y-1`
                        }`}
                      >
                        <span className="block text-xs font-black uppercase tracking-[0.14em]">{stateLabels[slot.state]}</span>
                        <span className="mt-3 block font-serif text-3xl font-black">{slot.startTime}</span>
                        <span className="mt-1 block text-sm font-semibold">Finaliza {slot.endTime}</span>
                        <span className="mt-3 block text-sm font-black">{slot.available} cupos disponibles</span>
                      </button>
                    );
                  })}
                </div>
                {!slots.length && (
                  <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-900">
                    No hay horarios disponibles para esta combinación. Probá con otra fecha o experiencia.
                  </p>
                )}
              </div>
            )}

            {step === 'participants' && (
              <div>
                <StepHeader title="Participantes y precio" description="Ajustá la cantidad sin superar los cupos disponibles." />
                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_.9fr]">
                  <div className="space-y-4">
                    <ParticipantCounter label="Adultos" value={participants.adults} onMinus={() => changeParticipants('adults', -1)} onPlus={() => changeParticipants('adults', 1)} />
                    <ParticipantCounter label="Menores" value={participants.children} onMinus={() => changeParticipants('children', -1)} onPlus={() => changeParticipants('children', 1)} />
                    <label className="block rounded-[1.5rem] border border-emerald-950/10 bg-white p-4">
                      <span className="text-sm font-black text-emerald-950">Código promocional</span>
                      <input
                        value={customer.promoCode ?? ''}
                        onChange={(event) => setCustomer((current) => ({ ...current, promoCode: event.target.value.toUpperCase() }))}
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-amber-200"
                        placeholder="Ejemplo: BIRD10"
                      />
                    </label>
                  </div>
                  <PriceBox quote={quote} selectedExperience={selectedExperience} />
                </div>
                <StepActions
                  back={() => setStep('schedule')}
                  next={() => {
                    if (participants.adults + participants.children <= 0) {
                      setError('La reserva debe tener al menos una persona.');
                      return;
                    }
                    setError('');
                    setStep('customer');
                  }}
                  nextLabel="Continuar con datos"
                />
              </div>
            )}

            {step === 'customer' && (
              <div>
                <StepHeader title="Datos del cliente" description="Usaremos estos datos para confirmar la reserva y enviar el comprobante." />
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <TextField label="Nombre completo" value={customer.fullName} onChange={(value) => setCustomer((current) => ({ ...current, fullName: value }))} required />
                  <TextField label="Correo electrónico" type="email" value={customer.email} onChange={(value) => setCustomer((current) => ({ ...current, email: value }))} required />
                  <TextField label="Confirmación del correo" type="email" value={customer.emailConfirm} onChange={(value) => setCustomer((current) => ({ ...current, emailConfirm: value }))} required />
                  <div className="grid grid-cols-[5.5rem_1fr] gap-2">
                    <TextField label="Código" value={customer.countryCode} onChange={(value) => setCustomer((current) => ({ ...current, countryCode: value }))} required />
                    <TextField label="Teléfono" value={customer.phone} onChange={(value) => setCustomer((current) => ({ ...current, phone: value }))} required />
                  </div>
                  <TextField label="País de residencia" value={customer.country} onChange={(value) => setCustomer((current) => ({ ...current, country: value }))} required />
                  <SelectField
                    label="Idioma preferido"
                    value={customer.preferredLanguage}
                    onChange={(value) => setCustomer((current) => ({ ...current, preferredLanguage: value as CustomerDetails['preferredLanguage'] }))}
                    options={[
                      ['es', 'Español'],
                      ['en', 'English'],
                    ]}
                  />
                  <SelectField
                    label="Nivel de experiencia"
                    value={customer.experienceLevel}
                    onChange={(value) => setCustomer((current) => ({ ...current, experienceLevel: value as CustomerDetails['experienceLevel'] }))}
                    options={[
                      ['first_time', 'Primera experiencia'],
                      ['beginner', 'Principiante'],
                      ['intermediate', 'Intermedio'],
                      ['advanced', 'Avanzado'],
                      ['bird_photographer', 'Fotógrafo de aves'],
                    ]}
                  />
                  <TextField label="Usuario de eBird" value={customer.ebirdUsername ?? ''} onChange={(value) => setCustomer((current) => ({ ...current, ebirdUsername: value }))} />
                  <TextField label="Hospedaje" value={customer.lodgingName ?? ''} onChange={(value) => setCustomer((current) => ({ ...current, lodgingName: value }))} />
                  <TextField label="Medio de transporte" value={customer.transportMethod ?? ''} onChange={(value) => setCustomer((current) => ({ ...current, transportMethod: value }))} />
                  <TextArea label="Observaciones" value={customer.notes ?? ''} onChange={(value) => setCustomer((current) => ({ ...current, notes: value }))} />
                  <TextArea label="Necesidades especiales" value={customer.specialRequirements ?? ''} onChange={(value) => setCustomer((current) => ({ ...current, specialRequirements: value }))} />
                </div>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  <CheckboxField label="Me interesa recibir checklist" checked={Boolean(customer.wantsChecklist)} onChange={(value) => setCustomer((current) => ({ ...current, wantsChecklist: value }))} />
                  <CheckboxField label="Me interesa registrar la observación en eBird después" checked={Boolean(customer.wantsEbirdRegistration)} onChange={(value) => setCustomer((current) => ({ ...current, wantsEbirdRegistration: value }))} />
                  <CheckboxField label="Acepto términos y condiciones" checked={customer.acceptedTerms} onChange={(value) => setCustomer((current) => ({ ...current, acceptedTerms: value }))} required />
                  <CheckboxField label="Acepto política de cancelación" checked={customer.acceptedCancellation} onChange={(value) => setCustomer((current) => ({ ...current, acceptedCancellation: value }))} required />
                  <CheckboxField label="Acepto política de privacidad" checked={customer.acceptedPrivacy} onChange={(value) => setCustomer((current) => ({ ...current, acceptedPrivacy: value }))} required />
                  <CheckboxField label="Acepto recomendaciones de seguridad" checked={customer.acceptedSafety} onChange={(value) => setCustomer((current) => ({ ...current, acceptedSafety: value }))} required />
                </div>
                <StepActions
                  back={() => setStep('participants')}
                  next={() => {
                    if (validateCustomerStep()) setStep('payment');
                  }}
                  nextLabel="Revisar reserva"
                />
              </div>
            )}

            {step === 'payment' && !hold && (
              <ReviewStep
                selectedExperience={selectedExperience}
                selectedDate={selectedDate}
                selectedSlot={selectedSlot}
                participants={participants}
                customer={customer}
                quote={quote}
                edit={setStep}
                onContinue={createPaymentHold}
                loading={loading === 'hold'}
              />
            )}

            {step === 'payment' && hold && (
              <div>
                <StepHeader title="Pago o solicitud de reserva" description="Los cupos están retenidos temporalmente mientras completás este paso." />
                {holdSeconds !== null && (
                  <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900">
                    Retención activa: {Math.floor(holdSeconds / 60)}:{String(holdSeconds % 60).padStart(2, '0')}
                  </p>
                )}
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`rounded-[1.5rem] border p-4 text-left ${
                        paymentMethod === method.id ? 'border-emerald-950 bg-emerald-950 text-white' : 'border-emerald-950/10 bg-white text-slate-700'
                      }`}
                    >
                      <span className="block font-serif text-xl font-black">{method.label}</span>
                      <span className="mt-1 block text-sm opacity-80">{method.description}</span>
                    </button>
                  ))}
                </div>
                {quote && paymentMethod !== 'manual_pending' && (
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setPayFull(false)}
                      className={`rounded-2xl border p-4 text-left ${!payFull ? 'border-emerald-950 bg-emerald-950 text-white' : 'border-slate-200 bg-white'}`}
                    >
                      <span className="block text-sm font-black uppercase">Reservar con adelanto</span>
                      <span className="mt-2 block font-serif text-2xl font-black">{money(quote.depositAmount, quote.currency)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayFull(true)}
                      className={`rounded-2xl border p-4 text-left ${payFull ? 'border-emerald-950 bg-emerald-950 text-white' : 'border-slate-200 bg-white'}`}
                    >
                      <span className="block text-sm font-black uppercase">Pago completo</span>
                      <span className="mt-2 block font-serif text-2xl font-black">{money(quote.total, quote.currency)}</span>
                    </button>
                  </div>
                )}
                <StepActions
                  back={() => {
                    setHold(null);
                    setStep('customer');
                  }}
                  next={submitPayment}
                  nextLabel={paymentMethod === 'manual_pending' ? 'Enviar solicitud' : 'Completar reserva'}
                  loading={loading === 'payment'}
                />
              </div>
            )}

            {step === 'confirmation' && reservation && (
              <ConfirmationStep reservation={reservation} />
            )}
          </div>
        </section>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-[2rem] border border-emerald-950/10 bg-[#07180f] p-5 text-white shadow-2xl shadow-emerald-950/20">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Resumen</p>
            <h2 className="mt-2 font-serif text-2xl font-black">Tu reserva</h2>
            <SummaryLine label="Fecha" value={selectedDate ? longDate(selectedDate) : 'Pendiente'} />
            <SummaryLine label="Experiencia" value={selectedExperience?.name ?? 'Pendiente'} />
            <SummaryLine label="Horario" value={selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'Pendiente'} />
            <SummaryLine
              label="Participantes"
              value={`${participants.adults + participants.children} ${participants.adults + participants.children === 1 ? 'persona' : 'personas'}`}
            />
            {quote && (
              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <SummaryLine label="Subtotal" value={money(quote.subtotal, quote.currency)} />
                <SummaryLine label="Descuento" value={money(quote.discount, quote.currency)} />
                <SummaryLine label="Impuestos" value={money(quote.taxes, quote.currency)} />
                <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
                  <span className="text-sm font-bold text-white/70">Total</span>
                  <span className="font-serif text-2xl font-black text-amber-200">{money(quote.total, quote.currency)}</span>
                </div>
              </div>
            )}
            <p className="mt-5 text-sm leading-6 text-white/70">
              Los precios finales, disponibilidad y pagos se validan en el servidor antes de confirmar.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-black text-emerald-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-emerald-50 p-3">
      <dt className="text-xs font-black uppercase tracking-[0.12em] text-emerald-800">{label}</dt>
      <dd className="mt-1 font-bold text-emerald-950">{value}</dd>
    </div>
  );
}

function ParticipantCounter({ label, value, onMinus, onPlus }: { label: string; value: number; onMinus: () => void; onPlus: () => void }) {
  return (
    <div className="flex items-center justify-between rounded-[1.5rem] border border-emerald-950/10 bg-white p-4">
      <div>
        <p className="font-serif text-xl font-black text-emerald-950">{label}</p>
        <p className="text-sm text-slate-500">Usá los botones para ajustar</p>
      </div>
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMinus} className="grid h-11 w-11 place-items-center rounded-full bg-slate-100 text-2xl font-black text-emerald-950" aria-label={`Reducir ${label}`}>
          -
        </button>
        <span className="w-8 text-center text-2xl font-black text-emerald-950">{value}</span>
        <button type="button" onClick={onPlus} className="grid h-11 w-11 place-items-center rounded-full bg-emerald-950 text-2xl font-black text-white" aria-label={`Aumentar ${label}`}>
          +
        </button>
      </div>
    </div>
  );
}

function PriceBox({ quote, selectedExperience }: { quote: PriceQuote | null; selectedExperience?: ReservationExperience }) {
  if (!quote) {
    return (
      <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-600">
        Seleccioná participantes para calcular el total.
      </div>
    );
  }

  return (
    <div className="rounded-[1.5rem] border border-emerald-950/10 bg-[#07180f] p-5 text-white">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Precio actualizado</p>
      {selectedExperience?.pricing.mode === 'private_group' ? (
        <SummaryLine label="Precio del grupo" value={money(quote.groupPrice, quote.currency)} />
      ) : (
        <>
          <SummaryLine label="Adulto" value={money(quote.adultPrice, quote.currency)} />
          <SummaryLine label="Menor" value={money(quote.childPrice, quote.currency)} />
        </>
      )}
      <SummaryLine label="Subtotal" value={money(quote.subtotal, quote.currency)} />
      <SummaryLine label="Descuentos" value={money(quote.discount, quote.currency)} />
      <SummaryLine label="Impuestos" value={money(quote.taxes, quote.currency)} />
      <div className="mt-4 border-t border-white/15 pt-4">
        <SummaryLine label="Total" value={money(quote.total, quote.currency)} />
        <SummaryLine label="Monto para reservar" value={money(quote.depositAmount, quote.currency)} />
        <SummaryLine label="Saldo pendiente" value={money(quote.pendingAmount, quote.currency)} />
      </div>
    </div>
  );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3 flex items-start justify-between gap-4 text-sm">
      <span className="font-bold text-current opacity-70">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function StepActions({ back, next, nextLabel, loading = false }: { back: () => void; next: () => void; nextLabel: string; loading?: boolean }) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
      <button type="button" onClick={back} className="rounded-full border border-emerald-950/15 px-5 py-3 font-black text-emerald-950">
        Regresar
      </button>
      <button type="button" onClick={next} disabled={loading} className="rounded-full bg-emerald-950 px-6 py-3 font-black text-white disabled:bg-slate-300">
        {loading ? 'Procesando...' : nextLabel}
      </button>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-emerald-950">
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-amber-200"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block md:col-span-2">
      <span className="text-sm font-black text-emerald-950">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-amber-200"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: [string, string][];
}) {
  return (
    <label className="block">
      <span className="text-sm font-black text-emerald-950">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:ring-4 focus:ring-amber-200"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
  required = false,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}) {
  return (
    <label className="flex items-start gap-3 rounded-2xl border border-emerald-950/10 bg-white p-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 rounded border-slate-300 text-emerald-900 focus:ring-amber-300"
      />
      <span className="text-sm font-bold text-slate-700">
        {label}
        {required ? ' *' : ''}
      </span>
    </label>
  );
}

function ReviewStep({
  selectedExperience,
  selectedDate,
  selectedSlot,
  participants,
  customer,
  quote,
  edit,
  onContinue,
  loading,
}: {
  selectedExperience?: ReservationExperience;
  selectedDate: string;
  selectedSlot?: AvailabilitySlot;
  participants: ParticipantSelection;
  customer: CustomerDetails;
  quote: PriceQuote | null;
  edit: (step: ReservationStepId) => void;
  onContinue: () => void;
  loading: boolean;
}) {
  return (
    <div>
      <StepHeader title="Revisá la reserva" description="Antes de continuar, volveremos a validar disponibilidad en el servidor." />
      <div className="mt-6 grid gap-4">
        <ReviewCard title="Fecha" value={selectedDate ? longDate(selectedDate) : 'Pendiente'} onEdit={() => edit('date')} />
        <ReviewCard title="Experiencia" value={selectedExperience?.name ?? 'Pendiente'} onEdit={() => edit('experience')} />
        <ReviewCard title="Horario" value={selectedSlot ? `${selectedSlot.startTime} - ${selectedSlot.endTime}` : 'Pendiente'} onEdit={() => edit('schedule')} />
        <ReviewCard title="Participantes" value={`${participants.adults} adultos · ${participants.children} menores`} onEdit={() => edit('participants')} />
        <ReviewCard title="Datos personales" value={`${customer.fullName} · ${customer.email}`} onEdit={() => edit('customer')} />
      </div>
      {quote && (
        <div className="mt-5 rounded-[1.5rem] border border-emerald-950/10 bg-[#f8f3e8] p-5">
          <SummaryLine label="Subtotal" value={money(quote.subtotal, quote.currency)} />
          <SummaryLine label="Extras" value={money(quote.extras, quote.currency)} />
          <SummaryLine label="Descuentos" value={money(quote.discount, quote.currency)} />
          <SummaryLine label="Impuestos" value={money(quote.taxes, quote.currency)} />
          <SummaryLine label="Total" value={money(quote.total, quote.currency)} />
          <SummaryLine label="Monto requerido para reservar" value={money(quote.depositAmount, quote.currency)} />
          <SummaryLine label="Saldo pendiente" value={money(quote.pendingAmount, quote.currency)} />
        </div>
      )}
      <StepActions back={() => edit('customer')} next={onContinue} nextLabel="Continuar al pago" loading={loading} />
    </div>
  );
}

function ReviewCard({ title, value, onEdit }: { title: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-950/10 bg-white p-4">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">{title}</p>
        <p className="mt-1 font-bold text-slate-800">{value}</p>
      </div>
      <button type="button" onClick={onEdit} className="rounded-full border border-emerald-950/15 px-4 py-2 text-sm font-black text-emerald-950">
        Editar
      </button>
    </div>
  );
}

function ConfirmationStep({ reservation }: { reservation: ReservationRecord }) {
  const calendarUrl = useMemo(() => {
    const dateStamp = reservation.date.split('-').join('');
    const start = dateStamp + 'T' + reservation.startTime.replace(':', '') + '00';
    const end = dateStamp + 'T' + reservation.endTime.replace(':', '') + '00';
    const details = encodeURIComponent(`Reserva ${reservation.reservationCode} - ${reservation.packageName}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=Birdwatching%20LVA&dates=${start}/${end}&details=${details}`;
  }, [reservation]);

  return (
    <div className="text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-3xl font-black text-emerald-950">
        ✓
      </div>
      <h2 className="mt-5 font-serif text-3xl font-black text-emerald-950">Reserva recibida</h2>
      <p className="mt-2 text-slate-600">Guardá este código para cualquier consulta.</p>
      <p className="mx-auto mt-5 inline-flex rounded-full bg-emerald-950 px-5 py-3 font-serif text-2xl font-black text-amber-200">
        {reservation.reservationCode}
      </p>
      <div className="mx-auto mt-6 max-w-2xl rounded-[1.5rem] border border-emerald-950/10 bg-[#f8f3e8] p-5 text-left">
        <SummaryLine label="Cliente" value={reservation.customerName} />
        <SummaryLine label="Experiencia" value={reservation.packageName} />
        <SummaryLine label="Fecha" value={longDate(reservation.date)} />
        <SummaryLine label="Horario" value={`${reservation.startTime} - ${reservation.endTime}`} />
        <SummaryLine label="Participantes" value={`${reservation.totalParticipants}`} />
        <SummaryLine label="Estado de pago" value={reservation.paymentStatus} />
        <SummaryLine label="Total" value={money(reservation.total, reservation.currency)} />
        <SummaryLine label="Pagado" value={money(reservation.paidAmount, reservation.currency)} />
        <SummaryLine label="Saldo pendiente" value={money(reservation.pendingAmount, reservation.currency)} />
      </div>
      <div className="mx-auto mt-6 max-w-2xl rounded-[1.5rem] bg-emerald-950 p-5 text-left text-white">
        <h3 className="font-serif text-xl font-black">Indicaciones</h3>
        <p className="mt-3 text-sm leading-6 text-white/78">
          Llegá 15 minutos antes. Traé zapatos cerrados, ropa de colores naturales, agua, impermeable ligero, repelente,
          binoculares y cámara si deseas. Cancelaciones y cambios deben coordinarse por WhatsApp.
        </p>
      </div>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={`/reservas/confirmacion/${reservation.reservationCode}`}
          className="rounded-full bg-emerald-950 px-5 py-3 font-black text-white"
        >
          Abrir comprobante
        </Link>
        <a href={calendarUrl} target="_blank" rel="noreferrer" className="rounded-full bg-emerald-950 px-5 py-3 font-black text-white">
          Agregar al calendario
        </a>
        <button type="button" onClick={() => window.print()} className="rounded-full border border-emerald-950/15 px-5 py-3 font-black text-emerald-950">
          Descargar o imprimir comprobante
        </button>
        <Link href="/" className="rounded-full border border-emerald-950/15 px-5 py-3 font-black text-emerald-950">
          Volver al sitio
        </Link>
      </div>
      <a
        href={`https://wa.me/50684519537?text=${encodeURIComponent(`Hola, mi código de reserva es ${reservation.reservationCode}.`)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex rounded-full bg-amber-200 px-5 py-3 font-black text-emerald-950"
      >
        Contactar por WhatsApp
      </a>
    </div>
  );
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import type {
  ChangeLogEntry,
  ReservationConfig,
  ReservationHold,
  ReservationRecord,
  ReservationStatus,
} from '@/types/reservation';

type AdminPayload = {
  config: ReservationConfig;
  reservations: ReservationRecord[];
  holds: ReservationHold[];
  changeHistory: ChangeLogEntry[];
  persistence: 'durable' | 'memory';
};

type ApiPayload =
  | { ok: true; data: AdminPayload }
  | { ok: false; error: { code: string; message: string } };

const tokenStorageKey = 'lva-reservations-admin-token';

const reservationStatusLabels: Record<ReservationStatus, string> = {
  draft: 'Borrador',
  pending_payment: 'Pago pendiente',
  held: 'Cupo retenido',
  confirmed: 'Confirmada',
  paid: 'Pagada',
  partial_payment: 'Pago parcial',
  manual_verification_pending: 'Verificación manual',
  cancelled: 'Cancelada',
  expired: 'Expirada',
  refunded: 'Reembolsada',
  no_show: 'No se presentó',
  completed: 'Completada',
};

function money(value: number, currency: string): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function dateLabel(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('es-CR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function createdLabel(date: string): string {
  return new Date(date).toLocaleString('es-CR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function statusClass(status: ReservationStatus): string {
  if (status === 'paid' || status === 'confirmed' || status === 'completed') {
    return 'border-emerald-200 bg-emerald-50 text-emerald-900';
  }
  if (status === 'cancelled' || status === 'expired' || status === 'no_show') {
    return 'border-rose-200 bg-rose-50 text-rose-800';
  }
  return 'border-amber-200 bg-amber-50 text-amber-900';
}

export default function ReservationsAdminPanel() {
  const [token, setToken] = useState('');
  const [data, setData] = useState<AdminPayload | null>(null);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'pending'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadReservations = async (adminToken = token) => {
    if (!adminToken.trim()) {
      setError('Ingresá la clave administrativa.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/reservations/admin/availability', {
        headers: { 'x-admin-token': adminToken.trim() },
        cache: 'no-store',
      });
      const payload = (await response.json()) as ApiPayload;
      if (!payload.ok) throw new Error(payload.error.message);

      setData(payload.data);
      window.sessionStorage.setItem(tokenStorageKey, adminToken.trim());
    } catch (requestError) {
      setData(null);
      setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el panel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedToken = window.sessionStorage.getItem(tokenStorageKey);
    if (!savedToken) return;
    setToken(savedToken);
    void loadReservations(savedToken);
    // La sesión administrativa se recupera una sola vez al abrir la pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sortedReservations = useMemo(
    () => [...(data?.reservations ?? [])].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [data]
  );
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Costa_Rica' });
  const upcomingCount = sortedReservations.filter(
    (reservation) => reservation.date >= today && !['cancelled', 'expired'].includes(reservation.reservationStatus)
  ).length;
  const pendingCount = sortedReservations.filter((reservation) =>
    ['pending_payment', 'partial_payment', 'manual_verification_pending'].includes(reservation.reservationStatus)
  ).length;
  const visibleReservations = sortedReservations.filter((reservation) => {
    if (filter === 'upcoming') {
      return reservation.date >= today && !['cancelled', 'expired'].includes(reservation.reservationStatus);
    }
    if (filter === 'pending') {
      return ['pending_payment', 'partial_payment', 'manual_verification_pending'].includes(reservation.reservationStatus);
    }
    return true;
  });

  if (!data) {
    return (
      <section className="mx-auto max-w-lg rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-2xl shadow-emerald-950/10 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Acceso privado</p>
        <h1 className="mt-3 font-serif text-3xl font-black text-emerald-950">Panel de reservas</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Ingresá la clave administrativa para consultar clientes, fechas, pagos y solicitudes.
        </p>
        <form
          className="mt-6"
          onSubmit={(event) => {
            event.preventDefault();
            void loadReservations();
          }}
        >
          <label className="block text-sm font-black text-emerald-950" htmlFor="admin-token">
            Clave administrativa
          </label>
          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            autoComplete="current-password"
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-4 focus:ring-amber-200"
          />
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-rose-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-full bg-emerald-950 px-5 py-3 font-black text-white disabled:opacity-60"
          >
            {loading ? 'Verificando…' : 'Entrar al panel'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Administración</p>
          <h1 className="mt-2 font-serif text-4xl font-black text-emerald-950">Reservas recibidas</h1>
          <p className="mt-2 text-sm text-slate-600">Última actualización: {createdLabel(new Date().toISOString())}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void loadReservations()}
            disabled={loading}
            className="rounded-full bg-emerald-950 px-4 py-2.5 text-sm font-black text-white disabled:opacity-60"
          >
            {loading ? 'Actualizando…' : 'Actualizar'}
          </button>
          <button
            type="button"
            onClick={() => {
              window.sessionStorage.removeItem(tokenStorageKey);
              setToken('');
              setData(null);
            }}
            className="rounded-full border border-emerald-950/15 px-4 py-2.5 text-sm font-black text-emerald-950"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {data.persistence === 'memory' && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-950">
          <strong>Almacenamiento temporal:</strong> este proyecto todavía no tiene una base de datos conectada. Las reservas pueden
          perderse cuando Vercel reinicie el servidor; el panel muestra las que permanecen en la instancia activa.
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <AdminMetric label="Total recibidas" value={sortedReservations.length} />
        <AdminMetric label="Próximas" value={upcomingCount} />
        <AdminMetric label="Pagos pendientes" value={pendingCount} />
      </div>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filtrar reservas">
        {([
          ['all', 'Todas'],
          ['upcoming', 'Próximas'],
          ['pending', 'Pendientes'],
        ] as const).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFilter(value)}
            className={`rounded-full px-4 py-2 text-sm font-black ${
              filter === value ? 'bg-emerald-950 text-white' : 'border border-emerald-950/15 bg-white text-emerald-950'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {visibleReservations.map((reservation) => (
          <article key={reservation.id} className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-5 shadow-lg shadow-emerald-950/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-2xl font-black text-emerald-950">{reservation.customerName}</h2>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass(reservation.reservationStatus)}`}>
                    {reservationStatusLabels[reservation.reservationStatus]}
                  </span>
                </div>
                <p className="mt-1 font-mono text-xs font-bold text-slate-500">{reservation.reservationCode}</p>
              </div>
              <div className="text-left lg:text-right">
                <p className="font-serif text-2xl font-black text-emerald-950">{money(reservation.total, reservation.currency)}</p>
                <p className="text-xs font-semibold text-slate-500">Recibida {createdLabel(reservation.createdAt)}</p>
              </div>
            </div>

            <dl className="mt-5 grid gap-3 border-t border-emerald-950/10 pt-5 sm:grid-cols-2 lg:grid-cols-4">
              <AdminDetail label="Experiencia" value={reservation.packageName} />
              <AdminDetail label="Fecha y hora" value={`${dateLabel(reservation.date)} · ${reservation.startTime}`} />
              <AdminDetail
                label="Participantes"
                value={`${reservation.totalParticipants} ${reservation.totalParticipants === 1 ? 'persona' : 'personas'}`}
              />
              <AdminDetail label="Pago" value={`${money(reservation.paidAmount, reservation.currency)} pagado`} />
              <AdminDetail label="Correo" value={reservation.customerEmail} />
              <AdminDetail label="Teléfono" value={reservation.customerPhone} />
              <AdminDetail label="País" value={reservation.country} />
              <AdminDetail label="Saldo" value={money(reservation.pendingAmount, reservation.currency)} />
            </dl>
            {(reservation.notes || reservation.specialRequirements) && (
              <div className="mt-4 rounded-2xl bg-[#f8f3e8] p-4 text-sm leading-6 text-slate-700">
                {reservation.notes && <p><strong>Notas:</strong> {reservation.notes}</p>}
                {reservation.specialRequirements && <p><strong>Requerimientos:</strong> {reservation.specialRequirements}</p>}
              </div>
            )}
          </article>
        ))}

        {!visibleReservations.length && (
          <div className="rounded-[1.5rem] border border-dashed border-emerald-950/20 bg-white p-10 text-center text-slate-600">
            No hay reservas en este filtro.
          </div>
        )}
      </div>
    </section>
  );
}

function AdminMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-5">
      <p className="text-sm font-semibold text-slate-600">{label}</p>
      <p className="mt-1 font-serif text-3xl font-black text-emerald-950">{value}</p>
    </div>
  );
}

function AdminDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-black uppercase tracking-[0.1em] text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</dd>
    </div>
  );
}

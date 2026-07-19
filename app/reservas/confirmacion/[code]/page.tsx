import type { Metadata } from 'next';
import Link from 'next/link';
import PrintButton from '@/components/reservations/PrintButton';
import { findReservationByCode } from '@/lib/reservations/store';
import { formatLongDate } from '@/lib/reservations/dates';

export const metadata: Metadata = {
  title: 'Confirmación de reserva',
  description: 'Comprobante de reserva para tours de birdwatching en La Vieja Adventures.',
};

function money(value: number, currency: string): string {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function ReservationConfirmationPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const reservation = findReservationByCode(code);

  if (!reservation) {
    return (
      <main className="min-h-screen bg-[#f8f3e8] px-4 py-16 text-slate-950">
        <div className="mx-auto max-w-xl rounded-[2rem] bg-white p-8 text-center shadow-2xl shadow-emerald-950/10">
          <h1 className="font-serif text-3xl font-black text-emerald-950">Reserva no encontrada</h1>
          <p className="mt-3 text-slate-600">Revisá el código o contactanos por WhatsApp para ayudarte.</p>
          <Link href="/reservas" className="mt-6 inline-flex rounded-full bg-emerald-950 px-5 py-3 font-black text-white">
            Volver a reservas
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f3e8] px-4 py-10 text-slate-950 sm:px-6">
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-2xl shadow-emerald-950/10 sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Confirmación de reserva</p>
        <h1 className="mt-3 font-serif text-4xl font-black text-emerald-950">{reservation.reservationCode}</h1>
        <p className="mt-3 text-slate-600">Mostrá este código al llegar o usalo para consultar cambios.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Detail label="Cliente" value={reservation.customerName} />
          <Detail label="Experiencia" value={reservation.packageName} />
          <Detail label="Fecha" value={formatLongDate(reservation.date)} />
          <Detail label="Horario" value={`${reservation.startTime} - ${reservation.endTime}`} />
          <Detail label="Participantes" value={`${reservation.totalParticipants}`} />
          <Detail label="Estado del pago" value={reservation.paymentStatus} />
          <Detail label="Total" value={money(reservation.total, reservation.currency)} />
          <Detail label="Saldo pendiente" value={money(reservation.pendingAmount, reservation.currency)} />
        </div>

        <div className="mt-8 rounded-[1.5rem] bg-emerald-950 p-5 text-white">
          <h2 className="font-serif text-2xl font-black">Indicaciones de llegada</h2>
          <p className="mt-3 text-sm leading-6 text-white/78">
            Llegá 15 minutos antes. Traé zapatos cerrados, ropa cómoda de colores naturales, agua, impermeable ligero,
            repelente, binoculares y cámara si deseas. Para cambios, escribinos por WhatsApp.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <PrintButton />
          <a
            href={`https://wa.me/50684519537?text=${encodeURIComponent(`Hola, mi código de reserva es ${reservation.reservationCode}.`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-amber-200 px-5 py-3 text-center font-black text-emerald-950"
          >
            WhatsApp
          </a>
          <Link href="/" className="rounded-full border border-emerald-950/15 px-5 py-3 text-center font-black text-emerald-950">
            Volver al sitio
          </Link>
        </div>
      </section>
    </main>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-[#f8f3e8] p-4">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-emerald-700">{label}</p>
      <p className="mt-1 font-bold text-emerald-950">{value}</p>
    </div>
  );
}

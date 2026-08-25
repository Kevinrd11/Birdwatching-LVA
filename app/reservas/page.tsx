import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import ReservationFlow from '@/components/reservations/ReservationFlow';

export const metadata: Metadata = {
  title: 'Reservas de birdwatching',
  description:
    'Sistema de reservas para tours de avistamiento de aves en La Vieja Adventures, Sucre, San Carlos, Costa Rica.',
  alternates: { canonical: '/reservas' },
};

export default function ReservasPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e8] text-slate-950">
      <header className="border-b border-white/10 bg-[#07180f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="La Vieja Adventures inicio">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/20 bg-[#f8f3e8]">
              <Image
                src="/logo-emblem.jpeg"
                alt="La Vieja Adventures Birdwatching"
                width={40}
                height={40}
                className="h-full w-full object-cover"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">La Vieja</span>
              <span className="block font-serif text-base font-semibold tracking-tight">Reservas</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-link text-link-light text-sm"
          >
            Inicio
          </Link>
        </div>
      </header>

      <ReservationFlow />
      <footer className="border-t border-emerald-950/10 px-4 py-8 text-center text-xs text-slate-500">
        <p>La Vieja Adventures · Sucre, San Carlos, Costa Rica</p>
        <p className="mt-2 text-slate-400">Diseño y desarrollo por Kevin Rojas Durán</p>
      </footer>
    </main>
  );
}

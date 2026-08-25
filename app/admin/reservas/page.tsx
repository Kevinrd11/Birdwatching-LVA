import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ReservationsAdminPanel from '@/components/reservations/ReservationsAdminPanel';

export const metadata: Metadata = {
  title: 'Panel de reservas',
  description: 'Administración privada de reservas de La Vieja Adventures.',
  robots: { index: false, follow: false },
};

export default function ReservationsAdminPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e8] text-slate-950">
      <header className="border-b border-white/10 bg-[#07180f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="La Vieja Adventures inicio">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-emerald-200/30 bg-[#f8f3e8]">
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
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-emerald-100">La Vieja</span>
              <span className="block font-serif text-base font-bold tracking-tight">Administración</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/20"
          >
            Ir al sitio
          </Link>
        </div>
      </header>

      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <ReservationsAdminPanel />
      </div>
    </main>
  );
}

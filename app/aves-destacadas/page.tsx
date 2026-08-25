import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import MonthlyFeaturedBirds, { currentMonth } from '@/components/MonthlyFeaturedBirds';

export const metadata: Metadata = {
  title: `Aves destacadas de ${currentMonth}`,
  description:
    'Conocé las aves destacadas del mes en La Vieja Adventures: especies, mejores horarios de avistamiento y hábitats probables durante el tour de birdwatching en Sucre, San Carlos, Costa Rica.',
  alternates: { canonical: '/aves-destacadas' },
};

export default function AvesDestacadasPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e8] text-slate-950">
      <header className="border-b border-emerald-950/10 bg-[#07180f] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="La Vieja Adventures inicio">
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
              <span className="block font-serif text-base font-bold tracking-tight">Birdwatching LVA</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/20"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      <MonthlyFeaturedBirds variant="full" language="es" />

      <footer className="bg-[#04120c] px-4 py-8 text-center text-sm text-white/55 sm:px-6">
        <p className="font-serif text-lg font-bold text-white">La Vieja Adventures</p>
        <p className="mt-2">Sucre, San Carlos, Costa Rica · Birdwatching LVA</p>
      </footer>
    </main>
  );
}

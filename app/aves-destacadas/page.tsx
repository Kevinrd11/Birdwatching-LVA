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
              <span className="block font-serif text-base font-semibold tracking-tight">Birdwatching LVA</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-link text-link-light text-sm"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      <MonthlyFeaturedBirds variant="full" language="es" />

      <footer className="bg-[#04120c] px-4 py-8 text-center text-sm text-white/55 sm:px-6">
        <p className="font-serif text-lg font-semibold text-white">La Vieja Adventures</p>
        <p className="mt-2">Sucre, San Carlos, Costa Rica · Birdwatching LVA</p>
        <p className="mt-4 text-xs text-white/35">Diseño y desarrollo por Kevin Rojas Durán</p>
      </footer>
    </main>
  );
}

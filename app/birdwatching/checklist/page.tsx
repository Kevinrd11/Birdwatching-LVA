import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import BirdChecklist from '@/components/birdwatching/BirdChecklist';

export const metadata: Metadata = {
  title: 'Checklist Digital de Aves',
  description:
    'Llevá tu checklist de aves durante el tour de Birdwatching LVA en Sucre, San Carlos, Costa Rica, y descargá un recuerdo digital de tu experiencia.',
  alternates: { canonical: '/birdwatching/checklist' },
};

export default function ChecklistPage() {
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

      <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <div className="text-center">
          <p className="eyebrow text-teal-700">Birdwatching LVA · Checklist del tour</p>
          <h1 className="section-title mx-auto max-w-3xl text-4xl sm:text-5xl">Checklist Digital de Aves</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Durante tu recorrido por los bosques de Sucre, San Carlos, marcá cada ave que observes, escuches o
            fotografíes. Tu progreso se guarda solo en este dispositivo y al final podrás descargar un recuerdo de tu
            experiencia.
          </p>
        </div>

        <div className="mt-12">
          <BirdChecklist />
        </div>
      </section>

      <footer className="bg-[#04120c] px-4 py-8 text-center text-sm text-white/55 sm:px-6">
        <p className="font-serif text-lg font-bold text-white">La Vieja Adventures</p>
        <p className="mt-2">Sucre, San Carlos, Costa Rica · Birdwatching LVA</p>
        <p className="mt-3 text-xs text-white/40">
          Fotografías de referencia de las especies: Wikimedia Commons (licencias libres).
        </p>
      </footer>
    </main>
  );
}

'use client';

import { forwardRef } from 'react';
import type { BirdSpecies } from '@/types/birdwatching';
import type { ChecklistCounts } from './ChecklistSummary';

type ShareableTourSummaryProps = {
  counts: ChecklistCounts;
  seenBirds: BirdSpecies[];
  photographedBirds: BirdSpecies[];
  dateLabel: string;
};

function BirdList({ title, birds, emptyText }: { title: string; birds: BirdSpecies[]; emptyText: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{title}</p>
      {birds.length > 0 ? (
        <ul className="mt-2 space-y-1">
          {birds.map((bird) => (
            <li key={bird.id} className="text-sm leading-6 text-white">
              {bird.commonNameEs}
              <span className="text-emerald-200"> · {bird.commonNameEn}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm italic text-emerald-200/90">{emptyText}</p>
      )}
    </div>
  );
}

// Bloque visual del recuerdo digital. Diseñado para verse idéntico en pantalla y
// al exportarse como imagen/PDF: usa solo colores sólidos (sin filtros blur ni
// fondos translúcidos), que html-to-image rasteriza de forma fiable.
const ShareableTourSummary = forwardRef<HTMLDivElement, ShareableTourSummaryProps>(function ShareableTourSummary(
  { counts, seenBirds, photographedBirds, dateLabel },
  ref
) {
  return (
    <div
      ref={ref}
      className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#07180f] p-8 text-white sm:p-10"
    >
      {/* Acentos decorativos sólidos (sin blur, para una exportación fiel). */}
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#0f3d28]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#123b27]"
        aria-hidden="true"
      />

      <div className="relative">
        <div className="flex items-center gap-4">
          <img
            src="/logo-emblem.jpeg"
            alt="La Vieja Adventures Birdwatching"
            width={64}
            height={64}
            className="h-16 w-16 rounded-full border border-white/15 bg-[#f8f3e8] object-cover"
          />
          <div>
            <h2 className="font-serif text-3xl font-black leading-none tracking-tight">
              Mi experiencia Birdwatching LVA
            </h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-200">
              Sucre, San Carlos, Costa Rica
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-y border-emerald-200/20 py-4">
          <p className="font-serif text-xl italic text-amber-300">“El privilegio de la primera mirada”</p>
          <p className="text-sm font-bold text-emerald-100">{dateLabel}</p>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-2xl bg-[#0f2a1c] p-4">
            <strong className="block font-serif text-3xl font-black text-emerald-300">{counts.seen}</strong>
            <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-emerald-100">Vistas</span>
          </div>
          <div className="rounded-2xl bg-[#0f2a1c] p-4">
            <strong className="block font-serif text-3xl font-black text-teal-300">{counts.heard}</strong>
            <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-emerald-100">Escuchadas</span>
          </div>
          <div className="rounded-2xl bg-[#0f2a1c] p-4">
            <strong className="block font-serif text-3xl font-black text-amber-300">{counts.photographed}</strong>
            <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-emerald-100">Fotografiadas</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <BirdList title="Aves vistas" birds={seenBirds} emptyText="Sin registros todavía." />
          <BirdList title="Aves fotografiadas" birds={photographedBirds} emptyText="Sin registros todavía." />
        </div>

        <p className="mt-8 text-center font-serif text-2xl font-black tracking-tight text-white">
          La Vieja Adventures
        </p>
      </div>
    </div>
  );
});

export default ShareableTourSummary;

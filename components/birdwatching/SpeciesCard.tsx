'use client';

import Image from 'next/image';
import type { BirdChecklistStatus, BirdSpecies, ChecklistField } from '@/types/birdwatching';

type ToggleConfig = {
  field: ChecklistField;
  label: string;
  icon: string;
  // Clases del estado activo (paleta de marca: verde / turquesa / ámbar).
  activeClasses: string;
};

const toggles: ToggleConfig[] = [
  {
    field: 'seen',
    label: 'Vista',
    icon: '👁',
    activeClasses: 'border-emerald-600 bg-emerald-600 text-white shadow-emerald-700/30',
  },
  {
    field: 'heard',
    label: 'Escuchada',
    icon: '🔊',
    activeClasses: 'border-teal-500 bg-teal-500 text-white shadow-teal-600/30',
  },
  {
    field: 'photographed',
    label: 'Fotografiada',
    icon: '📷',
    activeClasses: 'border-amber-500 bg-amber-500 text-emerald-950 shadow-amber-600/30',
  },
];

type SpeciesCardProps = {
  species: BirdSpecies;
  status: BirdChecklistStatus;
  onToggle: (speciesId: string, field: ChecklistField) => void;
};

export default function SpeciesCard({ species, status, onToggle }: SpeciesCardProps) {
  const anyMarked = status.seen || status.heard || status.photographed;

  return (
    <article
      className={`flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition ${
        anyMarked ? 'border-emerald-300 shadow-emerald-900/10' : 'border-emerald-950/10'
      }`}
    >
      <div className="relative aspect-[4/3] w-full bg-emerald-950/5">
        <Image
          src={species.image}
          alt={`${species.commonNameEs} (${species.scientificName})`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-teal-700 shadow-sm backdrop-blur-sm">
          {species.category}
        </span>
        {anyMarked && (
          <span
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-emerald-600 text-sm text-white shadow-md"
            aria-hidden="true"
          >
            ✓
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-black leading-tight text-emerald-950">{species.commonNameEs}</h3>
        <p className="text-sm font-semibold text-slate-500">{species.commonNameEn}</p>
        <p className="text-sm italic text-emerald-800">{species.scientificName}</p>

        <p className="mt-3 text-sm leading-6 text-slate-600">{species.description}</p>

        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span aria-hidden="true">📍</span>
          {species.suggestedZone}
        </p>

        <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
        {toggles.map((toggle) => {
          const active = status[toggle.field];
          return (
            <button
              key={toggle.field}
              type="button"
              aria-pressed={active}
              aria-label={`${toggle.label}: ${species.commonNameEs}`}
              onClick={() => onToggle(species.id, toggle.field)}
              className={`flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-2xl border-2 px-2 py-2 text-xs font-black transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 ${
                active
                  ? `${toggle.activeClasses} shadow-md`
                  : 'border-emerald-950/10 bg-[#f8f3e8] text-slate-600 hover:border-emerald-300'
              }`}
            >
              <span className="text-base leading-none" aria-hidden="true">
                {toggle.icon}
              </span>
              <span className="leading-none">{toggle.label}</span>
            </button>
          );
        })}
        </div>
      </div>
    </article>
  );
}

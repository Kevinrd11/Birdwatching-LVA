'use client';

export type ChecklistCounts = {
  total: number;
  seen: number;
  heard: number;
  photographed: number;
};

const stats: { key: keyof Omit<ChecklistCounts, 'total'> | 'total'; label: string; accent: string }[] = [
  { key: 'total', label: 'Especies disponibles', accent: 'text-emerald-950' },
  { key: 'seen', label: 'Vistas', accent: 'text-emerald-600' },
  { key: 'heard', label: 'Escuchadas', accent: 'text-teal-600' },
  { key: 'photographed', label: 'Fotografiadas', accent: 'text-amber-600' },
];

export default function ChecklistSummary({ counts }: { counts: ChecklistCounts }) {
  const hasRecords = counts.seen > 0 || counts.heard > 0 || counts.photographed > 0;

  return (
    <section
      className="rounded-[2rem] border border-emerald-950/10 bg-white p-6 shadow-sm sm:p-8"
      aria-label="Resumen del tour"
    >
      <h2 className="font-serif text-2xl font-black tracking-tight text-emerald-950">Resumen del tour</h2>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.key} className="rounded-2xl bg-[#f8f3e8] p-4 text-center">
            <strong className={`block font-serif text-3xl font-black ${stat.accent}`}>
              {counts[stat.key]}
            </strong>
            <span className="mt-1 block text-xs font-bold uppercase tracking-wide text-slate-500">
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-6 text-base leading-7 text-slate-700">
        {hasRecords ? (
          <>
            Hoy registraste <strong className="text-emerald-700">{counts.seen}</strong> especies vistas,{' '}
            <strong className="text-teal-700">{counts.heard}</strong> escuchadas y{' '}
            <strong className="text-amber-700">{counts.photographed}</strong> fotografiadas durante tu experiencia
            Birdwatching LVA.
          </>
        ) : (
          'Aún no has marcado especies. Conforme avance el tour, registrá las aves que observes, escuches o fotografíes.'
        )}
      </p>
    </section>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { birdwatchingSpecies } from '@/data/birdwatchingSpecies';
import type { ChecklistField, ChecklistState } from '@/types/birdwatching';
import {
  clearStoredChecklist,
  createEmptyStatus,
  loadChecklist,
  saveChecklist,
} from '@/utils/checklistStorage';
import { exportSummaryAsImage, exportSummaryAsPdf } from '@/utils/exportTourSummary';
import SpeciesCard from './SpeciesCard';
import ChecklistSummary, { type ChecklistCounts } from './ChecklistSummary';
import ShareableTourSummary from './ShareableTourSummary';

type Feedback = { type: 'working' | 'success' | 'error'; message: string } | null;

export default function BirdChecklist() {
  const [state, setState] = useState<ChecklistState>({});
  const [mounted, setMounted] = useState(false);
  const [dateLabel, setDateLabel] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const summaryRef = useRef<HTMLDivElement>(null);

  // Carga del progreso guardado: solo del lado cliente, tras montar.
  useEffect(() => {
    setState(loadChecklist());
    setDateLabel(
      new Date().toLocaleDateString('es-CR', { day: 'numeric', month: 'long', year: 'numeric' })
    );
    setMounted(true);
  }, []);

  // Guardado automático en localStorage (solo después de la carga inicial).
  useEffect(() => {
    if (!mounted) return;
    saveChecklist(state);
  }, [state, mounted]);

  // El mensaje de feedback se oculta solo tras unos segundos.
  useEffect(() => {
    if (!feedback || feedback.type === 'working') return;
    const timer = window.setTimeout(() => setFeedback(null), 4000);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleToggle = useCallback((speciesId: string, field: ChecklistField) => {
    setState((prev) => {
      const current = prev[speciesId] ?? createEmptyStatus(speciesId);
      return { ...prev, [speciesId]: { ...current, [field]: !current[field] } };
    });
  }, []);

  const counts: ChecklistCounts = useMemo(() => {
    let seen = 0;
    let heard = 0;
    let photographed = 0;
    for (const species of birdwatchingSpecies) {
      const status = state[species.id];
      if (status?.seen) seen += 1;
      if (status?.heard) heard += 1;
      if (status?.photographed) photographed += 1;
    }
    return { total: birdwatchingSpecies.length, seen, heard, photographed };
  }, [state]);

  const seenBirds = useMemo(() => birdwatchingSpecies.filter((s) => state[s.id]?.seen), [state]);
  const photographedBirds = useMemo(
    () => birdwatchingSpecies.filter((s) => state[s.id]?.photographed),
    [state]
  );

  const handleExport = useCallback(async (kind: 'image' | 'pdf') => {
    if (!summaryRef.current) return;
    setFeedback({ type: 'working', message: kind === 'image' ? 'Generando imagen…' : 'Generando PDF…' });
    try {
      if (kind === 'image') {
        await exportSummaryAsImage(summaryRef.current, 'birdwatching-lva.png');
      } else {
        await exportSummaryAsPdf(summaryRef.current, 'birdwatching-lva.pdf');
      }
      setFeedback({ type: 'success', message: '¡Listo! Revisá la carpeta de descargas de tu dispositivo.' });
    } catch {
      setFeedback({ type: 'error', message: 'No se pudo generar la descarga. Intentá de nuevo.' });
    }
  }, []);

  const handleClearConfirmed = useCallback(() => {
    clearStoredChecklist();
    setState({});
    setConfirmOpen(false);
    setFeedback({ type: 'success', message: 'Checklist reiniciado.' });
  }, []);

  // Cierre del modal con Escape.
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setConfirmOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [confirmOpen]);

  const exporting = feedback?.type === 'working';

  return (
    <div className="space-y-10">
      <ChecklistSummary counts={counts} />

      <section aria-label="Lista de aves">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {birdwatchingSpecies.map((species) => (
            <SpeciesCard
              key={species.id}
              species={species}
              status={state[species.id] ?? createEmptyStatus(species.id)}
              onToggle={handleToggle}
            />
          ))}
        </div>
      </section>

      <section aria-label="Recuerdo digital del tour" className="space-y-6">
        <div className="text-center">
          <p className="eyebrow text-teal-700">Recuerdo digital</p>
          <h2 className="section-title text-3xl sm:text-4xl">Tu recuerdo del tour</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Descargá un resumen visual de tu experiencia para guardarlo o compartirlo.
          </p>
        </div>

        <ShareableTourSummary
          ref={summaryRef}
          counts={counts}
          seenBirds={seenBirds}
          photographedBirds={photographedBirds}
          dateLabel={dateLabel}
        />

        {feedback && (
          <p
            role="status"
            aria-live="polite"
            className={`mx-auto max-w-2xl rounded-2xl px-4 py-3 text-center text-sm font-bold ${
              feedback.type === 'error'
                ? 'bg-red-50 text-red-700'
                : feedback.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-teal-50 text-teal-700'
            }`}
          >
            {feedback.message}
          </p>
        )}

        <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row sm:justify-center">
          <button type="button" onClick={() => handleExport('image')} disabled={exporting} className="btn disabled:opacity-60">
            Descargar resumen como imagen
          </button>
          <button
            type="button"
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="inline-flex min-h-[3.2rem] items-center justify-center gap-2 rounded-full bg-emerald-700 px-5 py-3 font-black text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 disabled:opacity-60"
          >
            Descargar resumen como PDF
          </button>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="inline-flex min-h-[3.2rem] items-center justify-center gap-2 rounded-full border-2 border-emerald-950/15 px-5 py-3 font-black text-emerald-950 transition hover:border-red-300 hover:text-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            Limpiar checklist
          </button>
        </div>
      </section>

      {confirmOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar limpieza del checklist"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#04120c]/85 p-4 backdrop-blur-sm"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[2rem] bg-white p-7 text-center shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-2xl" aria-hidden="true">
              🗑
            </span>
            <h3 className="mt-4 font-serif text-2xl font-black text-emerald-950">
              ¿Deseás limpiar todos los registros de este tour?
            </h3>
            <p className="mt-2 text-sm text-slate-600">Esta acción no se puede deshacer.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 rounded-full border-2 border-emerald-950/15 px-5 py-3 font-black text-emerald-950 transition hover:bg-emerald-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearConfirmed}
                className="flex-1 rounded-full bg-red-600 px-5 py-3 font-black text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-300"
              >
                Sí, limpiar checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

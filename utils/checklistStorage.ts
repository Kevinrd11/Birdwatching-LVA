import type { BirdChecklistStatus, ChecklistState } from '@/types/birdwatching';

// Clave de almacenamiento local del checklist (versionada por si cambia el formato).
export const CHECKLIST_STORAGE_KEY = 'lva-birdwatching-checklist-v1';

export function createEmptyStatus(speciesId: string): BirdChecklistStatus {
  return { speciesId, seen: false, heard: false, photographed: false };
}

/**
 * Lee el checklist guardado. Devuelve {} si no hay datos, si estamos en el
 * servidor o si el contenido está corrupto. Nunca lanza.
 */
export function loadChecklist(): ChecklistState {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed as ChecklistState;
  } catch {
    return {};
  }
}

/** Guarda el checklist. Ignora errores de cuota o de modo privado. */
export function saveChecklist(state: ChecklistState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Sin acción: el almacenamiento puede estar lleno o deshabilitado.
  }
}

/** Borra por completo el checklist guardado. */
export function clearStoredChecklist(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(CHECKLIST_STORAGE_KEY);
  } catch {
    // Sin acción.
  }
}

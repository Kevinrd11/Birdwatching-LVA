// Tipos del Checklist Digital de Aves — Birdwatching LVA

export type BirdSpecies = {
  id: string;
  commonNameEs: string;
  commonNameEn: string;
  scientificName: string;
  category: string;
  suggestedZone: string;
  description: string;
  image: string;
};

export type BirdChecklistStatus = {
  speciesId: string;
  seen: boolean;
  heard: boolean;
  photographed: boolean;
};

// Campos booleanos marcables en cada especie.
export type ChecklistField = 'seen' | 'heard' | 'photographed';

// Estado completo del checklist, indexado por id de especie.
export type ChecklistState = Record<string, BirdChecklistStatus>;

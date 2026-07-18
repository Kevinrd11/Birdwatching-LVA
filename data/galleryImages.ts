// Datos compartidos de la galería visual (fotos reales tomadas en La Vieja
// Adventures). Se usan tanto en el avance de la página principal como en la
// página de galería completa (/galeria).

export type GalleryImageData = {
  file: string;
  scientificName?: string;
  es: { alt: string; label: string };
  en: { alt: string; label: string };
};

export const birdwatchingImage = (fileName: string) => `/images/birdwatching/${fileName}`;

export const galleryImages: GalleryImageData[] = [
  {
    file: 'ade4cbcb-0faa-48a1-9d51-e1ef35b4ea76.jpeg',
    scientificName: 'Xenops rutilans',
    es: {
      alt: 'Fotografía de referencia del tour de birdwatching de La Vieja Adventures',
      label: 'Xenops rayado',
    },
    en: {
      alt: 'Reference photo from the La Vieja Adventures birdwatching tour',
      label: 'Streaked Xenops',
    },
  },
  {
    file: '10e47434-c50d-4425-b82b-ed4236d80b5d.jpeg',
    scientificName: 'Sporophila corvina',
    es: {
      alt: 'Imagen de referencia de aves y naturaleza para la experiencia guiada',
      label: 'Semillero variable',
    },
    en: {
      alt: 'Reference image of birds and nature for the guided experience',
      label: 'Variable Seedeater',
    },
  },
  {
    file: '5aff8c5b-442c-4ef8-8acb-412c073f9100.jpeg',
    scientificName: 'Amazilia tzacatl',
    es: {
      alt: 'Fotografía de referencia de biodiversidad local en el recorrido',
      label: 'Colibrí de cola rufa',
    },
    en: {
      alt: 'Reference photo of local biodiversity along the route',
      label: 'Rufous-tailed Hummingbird',
    },
  },
  {
    file: '2f727422-8f07-4936-8c40-69e9d530a087.jpeg',
    scientificName: 'Melanerpes pucherani',
    es: {
      alt: 'Imagen del entorno natural usado como referencia visual de la página',
      label: 'Carpintero carinegro',
    },
    en: {
      alt: 'Image of the natural setting used as visual reference for the page',
      label: 'Black-cheeked Woodpecker',
    },
  },
  {
    file: 'b8cd51a3-ba04-4c29-88ba-fa3b88e07bf3.jpeg',
    scientificName: 'Piranga rubra',
    es: {
      alt: 'Fotografía de referencia para senderos y puntos de observación',
      label: 'Tangara veranera',
    },
    en: {
      alt: 'Reference photo for trails and observation points',
      label: 'Summer Tanager',
    },
  },
  {
    file: '31555f0b-5b6c-43cc-a3ef-efd8976a0a10.jpeg',
    scientificName: 'Colaptes rubiginosus',
    es: {
      alt: 'Imagen de referencia del ambiente de La Vieja Adventures',
      label: 'Carpintero oliváceo',
    },
    en: {
      alt: 'Reference image of the La Vieja Adventures environment',
      label: 'Golden-olive Woodpecker',
    },
  },
  {
    file: '8a916eb1-9ac7-4eef-9ca5-4e7fca45fbe7.jpeg',
    scientificName: 'Thraupis episcopus',
    es: {
      alt: 'Fotografía de referencia para composición de naturaleza y aves',
      label: 'Tangara azulada',
    },
    en: {
      alt: 'Reference photo for nature and bird composition',
      label: 'Blue-gray Tanager',
    },
  },
  {
    file: '5adaf470-7207-482e-a023-dcb2fa9f1fb6.jpeg',
    scientificName: 'Phaethornis longirostris',
    es: {
      alt: 'Detalle visual de la experiencia de observación de aves',
      label: 'Ermitaño colilargo',
    },
    en: {
      alt: 'Visual detail from the birdwatching experience',
      label: 'Long-billed Hermit',
    },
  },
  {
    file: '100ccdec-209d-4d37-86ed-981a3060dc8d.jpeg',
    scientificName: 'Elaenia flavogaster',
    es: {
      alt: 'Imagen de referencia de naturaleza para el contenido web',
      label: 'Elaenia copetona',
    },
    en: {
      alt: 'Reference nature image for the website content',
      label: 'Yellow-bellied Elaenia',
    },
  },
  {
    file: 'a04cb7a1-b5f4-48fd-b5fc-38e05d5362c3.jpeg',
    scientificName: 'Amazilia tzacatl',
    es: {
      alt: 'Fotografía de referencia para visitantes del tour de birdwatching',
      label: 'Colibrí de cola rufa',
    },
    en: {
      alt: 'Reference photo for visitors to the birdwatching tour',
      label: 'Rufous-tailed Hummingbird',
    },
  },
  {
    file: '94cbfada-965f-4039-8dc9-1f8042be93bd.jpeg',
    es: {
      alt: 'Imagen de referencia de paisaje natural de la experiencia',
      label: 'Paisaje',
    },
    en: {
      alt: 'Reference image of the experience natural landscape',
      label: 'Landscape',
    },
  },
  {
    file: '2ab6f78f-832a-4a94-901e-dc346f41dacb.jpeg',
    scientificName: 'Melanerpes hoffmannii',
    es: {
      alt: 'Fotografía de referencia de avistamiento y entorno rural',
      label: 'Carpintero de Hoffmann',
    },
    en: {
      alt: 'Reference photo of bird sightings and rural surroundings',
      label: "Hoffmann's Woodpecker",
    },
  },
  {
    file: '5207a9ea-d688-41a7-a4b8-4ab7c0e37ecc.jpeg',
    es: {
      alt: 'Imagen de referencia para cierre visual de la galería',
      label: 'La Vieja Adventures',
    },
    en: {
      alt: 'Reference image for the gallery closing visual',
      label: 'La Vieja Adventures',
    },
  },
];

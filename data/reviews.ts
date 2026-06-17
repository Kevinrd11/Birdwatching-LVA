// Testimonios de visitantes (reviews). Datos compartidos para la página /reviews.
// Bilingües por si en el futuro se reutilizan en una vista con selector de idioma.

export type Review = {
  quote: { es: string; en: string };
  author: string;
  detail: { es: string; en: string };
};

export const reviews: Review[] = [
  {
    quote: {
      es: 'Una experiencia íntima, silenciosa y muy profesional. El guía sabía exactamente dónde esperar y cómo leer el bosque.',
      en: 'An intimate, quiet, and highly professional experience. The guide knew exactly where to wait and how to read the forest.',
    },
    author: 'María G.',
    detail: { es: 'Viajera de naturaleza', en: 'Nature traveler' },
  },
  {
    quote: {
      es: 'Perfecto para fotografía: buena luz, paciencia y rutas sin prisa. Se siente auténtico, no masivo.',
      en: 'Perfect for photography: good light, patience, and unhurried routes. It feels authentic, not crowded.',
    },
    author: 'Daniel R.',
    detail: { es: 'Fotógrafo aficionado', en: 'Amateur photographer' },
  },
  {
    quote: {
      es: 'El amanecer, el café y las aves hicieron que fuera uno de los mejores momentos de nuestro viaje a Costa Rica.',
      en: 'The sunrise, coffee, and birds made this one of the best moments of our trip to Costa Rica.',
    },
    author: 'Sophie & Mark',
    detail: { es: 'Tour privado', en: 'Private tour' },
  },
];

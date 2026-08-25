'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { siteConfig, whatsappLink } from '@/lib/config';

type Language = 'es' | 'en';
type SightingChance = 'Alta' | 'Media' | 'Baja';

type FeaturedBird = {
  nameEs: string;
  nameEn: string;
  scientificName: string;
  category: string;
  sightingChance: SightingChance;
  bestTime: string;
  habitat: string;
  image: string;
};

type MonthlyFeaturedBirdsProps = {
  language?: Language;
  whatsappNumber?: string;
  // 'cta' muestra solo un llamado a la acción (sin fotos de aves), pensado para
  // la página principal. 'full' muestra todas las tarjetas con fotos.
  variant?: 'full' | 'cta';
};

export const currentMonth = 'Junio';

// Para actualizar esta sección cada mes, cambiá currentMonth y reemplazá/ajustá
// los elementos de featuredBirds. Las imágenes se toman de
// /public/images/birdwatching/ para usar fotos reales del repositorio.
export const featuredBirds: FeaturedBird[] = [
  {
    nameEs: 'Tangara azulada',
    nameEn: 'Blue-gray Tanager',
    scientificName: 'Thraupis episcopus',
    category: 'Ave colorida',
    sightingChance: 'Alta',
    bestTime: 'Mañana',
    habitat: 'Bordes de bosque y áreas abiertas con árboles',
    image: '/images/birdwatching/8a916eb1-9ac7-4eef-9ca5-4e7fca45fbe7.jpeg',
  },
  {
    nameEs: 'Colibrí de cola rufa',
    nameEn: 'Rufous-tailed Hummingbird',
    scientificName: 'Amazilia tzacatl',
    category: 'Colibrí',
    sightingChance: 'Alta',
    bestTime: 'Amanecer y primeras horas de la mañana',
    habitat: 'Jardines, flores y bordes de sendero',
    image: '/images/birdwatching/5aff8c5b-442c-4ef8-8acb-412c073f9100.jpeg',
  },
  {
    nameEs: 'Carpintero oliváceo',
    nameEn: 'Golden-olive Woodpecker',
    scientificName: 'Colaptes rubiginosus',
    category: 'Carpintero',
    sightingChance: 'Media',
    bestTime: 'Mañana',
    habitat: 'Bosque húmedo y árboles maduros',
    image: '/images/birdwatching/31555f0b-5b6c-43cc-a3ef-efd8976a0a10.jpeg',
  },
  {
    nameEs: 'Elaenia copetona',
    nameEn: 'Yellow-bellied Elaenia',
    scientificName: 'Elaenia flavogaster',
    category: 'Ave cantora',
    sightingChance: 'Media',
    bestTime: 'Mañana',
    habitat: 'Áreas abiertas, bordes de bosque y vegetación secundaria',
    image: '/images/birdwatching/100ccdec-209d-4d37-86ed-981a3060dc8d.jpeg',
  },
  {
    nameEs: 'Semillero variable',
    nameEn: 'Variable Seedeater',
    scientificName: 'Sporophila corvina',
    category: 'Semillero',
    sightingChance: 'Media',
    bestTime: 'Mañana y tardes frescas',
    habitat: 'Pastizales, áreas abiertas y bordes con semillas disponibles',
    image: '/images/birdwatching/10e47434-c50d-4425-b82b-ed4236d80b5d.jpeg',
  },
];

const copy = {
  es: {
    eyebrow: 'Temporada viva',
    title: 'Aves destacadas del mes',
    subtitle:
      'Cada mes el bosque revela nuevas oportunidades de observación. Estas son algunas de las especies que podrías encontrar durante una experiencia de birdwatching en La Vieja Adventures.',
    monthPrefix: 'Aves destacadas de',
    monthSelectorLabel: 'Mes disponible',
    futureReady: 'Selector preparado para futuras actualizaciones mensuales',
    category: 'Categoría',
    chance: 'Avistamiento',
    bestTime: 'Mejor horario',
    habitat: 'Hábitat probable',
    imageAltPrefix: 'Fotografía de referencia de',
    placeholder: 'Imagen por agregar',
    placeholderHint: 'Revisá la ruta en /public/images/birdwatching/',
    ctaTitle: '¿Querés intentar observarlas en persona?',
    ctaText:
      'Reservá una salida de birdwatching al amanecer y descubrí las aves que habitan los senderos, miradores y bosques de montaña de La Vieja Adventures.',
    primaryCta: 'Reservar tour de birdwatching',
    secondaryCta: 'Consultar especies por WhatsApp',
    viewFeatured: 'Ver aves del mes',
    viewFeaturedHint: 'Especies, horarios y hábitats',
    whatsappMessage:
      'Hola, quiero información sobre las aves destacadas del mes en La Vieja Adventures.\n\nMe interesa reservar un tour de birdwatching en Sucre, San Carlos.\n\nQuisiera consultar disponibilidad, precios y especies que se están observando actualmente.',
  },
  en: {
    eyebrow: 'Living season',
    title: 'Monthly featured birds',
    subtitle:
      'Each month the forest reveals new birding opportunities. These are some of the species you could find during a birdwatching experience at La Vieja Adventures.',
    monthPrefix: 'Featured birds for',
    monthSelectorLabel: 'Available month',
    futureReady: 'Selector prepared for future monthly updates',
    category: 'Category',
    chance: 'Sighting chance',
    bestTime: 'Best time',
    habitat: 'Likely habitat',
    imageAltPrefix: 'Reference photo of',
    placeholder: 'Image coming soon',
    placeholderHint: 'Check the path in /public/images/birdwatching/',
    ctaTitle: 'Want to try spotting them in person?',
    ctaText:
      'Book a sunrise birdwatching outing and discover the birds living around the trails, viewpoints, and mountain forests of La Vieja Adventures.',
    primaryCta: 'Book birdwatching tour',
    secondaryCta: 'Ask about species on WhatsApp',
    viewFeatured: 'View birds of the month',
    viewFeaturedHint: 'Species, timing, and habitats',
    whatsappMessage:
      'Hello, I want information about the featured birds of the month at La Vieja Adventures.\n\nI am interested in booking a birdwatching tour in Sucre, San Carlos.\n\nI would like to ask about availability, prices, and species currently being observed.',
  },
};

const monthByLanguage: Record<Language, string> = {
  es: currentMonth,
  en: 'June',
};

function FeaturedBirdImage({ bird, language }: { bird: FeaturedBird; language: Language }) {
  const [hasImageError, setHasImageError] = useState(false);
  const text = copy[language];

  if (hasImageError) {
    return (
      <div className="flex h-full min-h-[14rem] flex-col items-center justify-center bg-[#123b27] p-6 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-100">{text.placeholder}</p>
        <p className="mt-2 max-w-[14rem] text-xs leading-5 text-white/72">{text.placeholderHint}</p>
      </div>
    );
  }

  return (
    <Image
      src={bird.image}
      alt={`${text.imageAltPrefix} ${bird.nameEs}`}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className="object-cover transition-transform duration-700 group-hover:scale-[1.015]"
      onError={() => setHasImageError(true)}
    />
  );
}

export default function MonthlyFeaturedBirds({
  language = 'es',
  whatsappNumber = siteConfig.whatsappNumber,
  variant = 'full',
}: MonthlyFeaturedBirdsProps) {
  const text = copy[language];
  const month = monthByLanguage[language];
  const whatsappUrl = useMemo(
    () => whatsappLink(text.whatsappMessage, whatsappNumber),
    [text.whatsappMessage, whatsappNumber]
  );

  if (variant === 'cta') {
    return (
      <section id="aves-destacadas" className="section border-b border-emerald-950/10 bg-[#f8f3e8]" aria-labelledby="monthly-birds-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-8">
          <div className="reveal order-2 lg:order-1">
            <p className="eyebrow text-emerald-800">{text.eyebrow} · {month}</p>
            <h2 id="monthly-birds-title" className="section-title">{text.title}</h2>
            <p className="mt-7 text-lg leading-8 text-slate-700">{text.subtitle}</p>
            <Link href="/aves-destacadas" className="text-link mt-8">
              {text.viewFeatured} <span aria-hidden="true">→</span>
            </Link>
            <p className="mt-4 text-sm text-slate-500">{text.viewFeaturedHint}</p>
          </div>
          <figure className="reveal relative order-1 aspect-[5/4] overflow-hidden bg-[#e6e0d4] lg:order-2 lg:aspect-[4/3]">
            <Image
              src="/images/birdwatching/5aff8c5b-442c-4ef8-8acb-412c073f9100.jpeg"
              alt={`${text.imageAltPrefix} ${featuredBirds[1].nameEs}`}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover transition-transform duration-700 hover:scale-[1.015]"
            />
          </figure>
        </div>
      </section>
    );
  }

  return (
    <section id="aves-destacadas" className="section bg-[#f8f3e8]" aria-labelledby="monthly-birds-title">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal max-w-3xl">
          <p className="eyebrow text-emerald-800">{text.eyebrow} · {month}</p>
          <h2 id="monthly-birds-title" className="section-title">{text.title}</h2>
          <p className="mt-7 text-lg leading-8 text-slate-700">{text.subtitle}</p>
        </div>

        <div className="reveal mt-14 grid gap-x-7 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
          {featuredBirds.map((bird) => (
            <article key={bird.scientificName} className="group border-t border-emerald-950/15 pt-4 text-slate-950">
              <div className="relative h-64 overflow-hidden bg-emerald-950">
                <FeaturedBirdImage bird={bird} language={language} />
              </div>

              <div className="pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-emerald-800">
                  {bird.category} · {text.chance}: {bird.sightingChance}
                </p>
                <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight text-emerald-950">{bird.nameEs}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">{bird.nameEn}</p>
                <p className="mt-2 text-sm italic text-emerald-800">{bird.scientificName}</p>

                <dl className="mt-6 border-t border-emerald-950/10 text-sm">
                  <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-emerald-950/10 py-3">
                    <dt className="font-semibold text-emerald-950">{text.bestTime}</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{bird.bestTime}</dd>
                  </div>
                  <div className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-emerald-950/10 py-3">
                    <dt className="font-semibold text-emerald-950">{text.habitat}</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{bird.habitat}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-20 border-t border-emerald-950/20 pt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="eyebrow text-emerald-800">Birdwatching La Vieja Adventures</p>
              <h3 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-emerald-950 sm:text-4xl">{text.ctaTitle}</h3>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">{text.ctaText}</p>
            </div>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="/#contacto" className="btn whitespace-nowrap">
                {text.primaryCta}
              </a>
              <a href={whatsappUrl} className="text-link whitespace-nowrap" target="_blank" rel="noreferrer">
                {text.secondaryCta} <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

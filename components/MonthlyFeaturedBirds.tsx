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

const chanceStyles: Record<SightingChance, string> = {
  Alta: 'bg-emerald-100 text-emerald-950 ring-emerald-300/70',
  Media: 'bg-amber-100 text-amber-950 ring-amber-300/70',
  Baja: 'bg-slate-100 text-slate-700 ring-slate-300/70',
};

function FeaturedBirdImage({ bird, language }: { bird: FeaturedBird; language: Language }) {
  const [hasImageError, setHasImageError] = useState(false);
  const text = copy[language];

  if (hasImageError) {
    return (
      <div className="flex h-full min-h-[14rem] flex-col items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(245,200,106,.36),transparent_28%),linear-gradient(135deg,#0b2a1b,#1f6a43_52%,#d9ab53)] p-6 text-center text-white">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/15 text-3xl shadow-inner shadow-white/10 backdrop-blur-sm" aria-hidden="true">
          ◌
        </span>
        <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-amber-100">{text.placeholder}</p>
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
      className="object-cover transition duration-500 group-hover:scale-105"
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
      <section id="aves-destacadas" className="section relative overflow-hidden bg-[#07180f] text-white" aria-labelledby="monthly-birds-title">
        {/* Foto real de la galería como textura de fondo (oscurecida para legibilidad). */}
        <Image
          src="/images/birdwatching/5aff8c5b-442c-4ef8-8acb-412c073f9100.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#07180f]/85" aria-hidden="true" />
        {/* Degradado de salida hacia la sección clara siguiente, para que el cambio sea sutil al hacer scroll. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-white" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-amber-100 backdrop-blur-sm">
            <span aria-hidden="true">🪶</span>
            {text.eyebrow} · {month}
          </span>
          <h2 id="monthly-birds-title" className="mt-6 section-title text-white">{text.title}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">{text.subtitle}</p>
          <Link
            href="/aves-destacadas"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-amber-200 px-8 py-4 text-base font-black uppercase tracking-[0.12em] text-emerald-950 shadow-lg shadow-amber-900/20 transition duration-300 hover:scale-[1.03] hover:bg-amber-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            {text.viewFeatured}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <span className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100/80">
            {text.viewFeaturedHint}
          </span>
        </div>
      </section>
    );
  }

  return (
    <section id="aves-destacadas" className="section relative overflow-hidden bg-[#07180f] text-white" aria-labelledby="monthly-birds-title">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(217,171,83,.18),transparent_30%),radial-gradient(circle_at_86%_8%,rgba(47,123,75,.34),transparent_34%),linear-gradient(180deg,#07180f,#0d2a1c_52%,#f8f3e8_52%,#f8f3e8)]" aria-hidden="true" />
      <div className="absolute left-0 top-24 h-64 w-64 rounded-full bg-emerald-300/10 blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-32 right-0 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
          <div className="reveal">
            <p className="eyebrow text-amber-200">{text.eyebrow}</p>
            <h2 id="monthly-birds-title" className="section-title text-white">{text.title}</h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/76">{text.subtitle}</p>
          </div>

          <div className="reveal reveal-delay flex flex-col gap-4 rounded-[2rem] border border-white/15 bg-white/10 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">{text.monthSelectorLabel}</p>
              <p className="mt-2 text-2xl font-serif font-bold text-white">{text.monthPrefix} {month}</p>
            </div>
            <button
              type="button"
              className="inline-flex cursor-default items-center justify-center rounded-full border border-amber-200/40 bg-amber-200/15 px-4 py-3 text-sm font-black text-amber-100"
              aria-label={text.futureReady}
            >
              {month}
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredBirds.map((bird) => (
            <article key={bird.scientificName} className="group overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white text-slate-950 shadow-2xl shadow-emerald-950/10 reveal">
              <div className="relative h-56 overflow-hidden bg-emerald-950">
                <FeaturedBirdImage bird={bird} language={language} />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/92 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-950 shadow-lg backdrop-blur-sm">
                    {bird.category}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.14em] ring-1 ${chanceStyles[bird.sightingChance]}`}>
                    {bird.sightingChance}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-2xl font-black tracking-tight text-emerald-950">{bird.nameEs}</h3>
                <p className="mt-1 text-sm font-bold text-slate-500">{bird.nameEn}</p>
                <p className="mt-2 text-sm italic text-emerald-800">{bird.scientificName}</p>

                <dl className="mt-6 grid gap-3 text-sm">
                  <div className="rounded-2xl bg-[#f8f3e8] p-4">
                    <dt className="font-black text-emerald-950">{text.bestTime}</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{bird.bestTime}</dd>
                  </div>
                  <div className="rounded-2xl border border-emerald-950/10 p-4">
                    <dt className="font-black text-emerald-950">{text.habitat}</dt>
                    <dd className="mt-1 leading-6 text-slate-600">{bird.habitat}</dd>
                  </div>
                </dl>
              </div>
            </article>
          ))}
        </div>

        <div className="reveal mt-12 overflow-hidden rounded-[2.25rem] bg-[#0b2518] text-white shadow-2xl shadow-emerald-950/20">
          <div className="grid gap-8 p-7 sm:p-9 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
            <div>
              <p className="eyebrow text-amber-200">Birdwatching La Vieja Adventures</p>
              <h3 className="mt-3 font-serif text-3xl font-black tracking-tight sm:text-4xl">{text.ctaTitle}</h3>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-white/76">{text.ctaText}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <a href="/#contacto" className="btn whitespace-nowrap">
                {text.primaryCta}
              </a>
              <a href={whatsappUrl} className="btn btn-ghost whitespace-nowrap" target="_blank" rel="noreferrer">
                {text.secondaryCta}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

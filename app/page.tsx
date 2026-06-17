'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MonthlyFeaturedBirds from '@/components/MonthlyFeaturedBirds';
import { siteConfig, whatsappLink } from '@/lib/config';
import { galleryImages, birdwatchingImage } from '@/data/galleryImages';

type Language = 'es' | 'en';

type GalleryImage = {
  src: string;
  alt: string;
  label: string;
  scientificName?: string;
};

const whatsappNumber = siteConfig.whatsappNumber;
const heroImage = birdwatchingImage('ade4cbcb-0faa-48a1-9d51-e1ef35b4ea76.jpeg');

const content = {
  es: {
    languageName: 'Español',
    languageToggle: 'English',
    languageToggleAria: 'Cambiar idioma a inglés',
    whatsappMessage:
      'Hola La Vieja Adventures, quiero reservar una experiencia de Birdwatching. ¿Me pueden compartir disponibilidad y opciones?',
    navAria: 'Navegación principal',
    homeAria: 'La Vieja Adventures Birdwatching inicio',
    menu: 'Menú',
    openMobileMenu: 'Abrir menú móvil',
    skipLink: 'Saltar al contenido principal',
    navItems: [
      { label: 'Experiencias', href: '#experiencias' },
      { label: 'Galería', href: '#galeria' },
      { label: 'Aves del mes', href: '#aves-destacadas' },
      { label: 'Checklist del tour', href: '/birdwatching/checklist' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Incluye', href: '#incluye' },
      { label: 'FAQ', href: '#faq' },
    ],
    reserve: 'Reservar',
    reserveTour: 'Reservar Tour',
    contact: 'Contactar',
    seeExperiences: 'Ver Experiencias',
    reserveWhatsapp: 'Reservar por WhatsApp',
    keyFactsAria: 'Datos clave del tour',
    heroEyebrow: 'Birdwatching premium en Costa Rica',
    heroTitle: 'La Vieja Adventures Birdwatching',
    heroDescription:
      'Observa, fotografía y conecta con la biodiversidad de Sucre, San Carlos, en una experiencia guiada por locales que conocen los ritmos del bosque tropical.',
    recommendedEyebrow: 'Experiencia recomendada',
    recommendedTitle: 'Sunrise Birdwatching + Café Local',
    recommendedDescription:
      'Salida al amanecer, senderos privados, fotografía ética y cierre con café costarricense.',
    benefits: [
      { value: '120+', label: 'especies potenciales en la zona' },
      { value: '5:30', label: 'hora recomendada de salida' },
      { value: '100%', label: 'experiencia local auténtica' },
      { value: 'Bajo', label: 'impacto ambiental del tour' },
    ],
    highlightsAria: 'Beneficios destacados',
    highlights: ['Guías locales expertos', 'Reservas rápidas por WhatsApp', 'Turismo rural de bajo impacto'],
    checklistEyebrow: 'Nuevo · Durante el tour',
    checklistTitle: 'Llevá tu checklist de aves en el sendero',
    checklistDescription:
      'Mientras recorrés los senderos, marcá desde tu celular cada ave que veas, escuches o fotografíes. Tu progreso se guarda automáticamente y al final descargás un recuerdo digital de tu experiencia.',
    checklistFeatures: ['Pensado para tu celular', 'Guarda tu progreso automáticamente', 'Descargá tu recuerdo en imagen o PDF'],
    checklistCta: 'Abrir checklist del tour',
    checklistHint: 'Gratis · sin registro',
    checklistNav: 'Checklist',
    introEyebrow: 'Naturaleza, aventura y autenticidad',
    introTitle: 'Una experiencia diseñada para ver más que aves.',
    introParagraphs: [
      'La Vieja Adventures convierte el birdwatching en una inmersión tranquila y premium: senderos con ritmo pausado, lectura del paisaje, interpretación ambiental y espacios para fotografía sin prisa.',
      'La propuesta está pensada para viajeros que buscan Costa Rica real: biodiversidad, conocimiento local, hospitalidad rural y una aventura memorable lejos de experiencias masivas.',
    ],
    experiencesEyebrow: 'Modalidades',
    experiencesTitle: 'Elige la ruta ideal para tu forma de explorar.',
    experiences: [
      {
        title: 'Birdwatching Clásico',
        eyebrow: 'Ideal para empezar',
        duration: '2.5–3 horas',
        copy: 'Caminata guiada por senderos, estaciones de observación y puntos de alta actividad para descubrir especies locales con interpretación naturalista.',
        points: ['Guía local experto', 'Checklist de aves', 'Ritmo familiar'],
      },
      {
        title: 'Bird Photography Tour',
        eyebrow: 'Para fotógrafos',
        duration: '3.5–4 horas',
        copy: 'Ruta diseñada alrededor de luz, paciencia, composición y comportamiento ético para capturar aves sin alterar su entorno.',
        points: ['Luz de amanecer', 'Pausas extendidas', 'Consejos técnicos'],
      },
      {
        title: 'Sunrise + Café Local',
        eyebrow: 'Más reservado',
        duration: '5:30 a.m.',
        copy: 'Vive la actividad más intensa del bosque en las primeras horas y cierra la mañana con café costarricense y conversación local.',
        points: ['Aves activas', 'Café de la zona', 'Ambiente premium'],
      },
      {
        title: 'Private Birding Experience',
        eyebrow: 'Exclusivo',
        duration: 'Flexible',
        copy: 'Experiencia privada para parejas, familias o grupos pequeños, ajustada a tus intereses, condición física y objetivos de fotografía.',
        points: ['Ruta personalizada', 'Atención 1:1', 'Horarios a convenir'],
      },
    ],
    checkAvailability: 'Consultar disponibilidad →',
    galleryEyebrow: 'Galería visual',
    galleryTitle: 'Fotos reales tomadas en La Vieja Adventures.',
    galleryDescription:
      'Todas las fotografías fueron capturadas en La Vieja Adventures, el lugar donde se desarrolla el tour de birdwatching y fotografía de naturaleza. Tocá cualquier imagen para verla en grande.',
    galleryUi: {
      open: 'Ampliar imagen',
      close: 'Cerrar',
      prev: 'Imagen anterior',
      next: 'Imagen siguiente',
      viewer: 'Visor de galería',
      of: 'de',
    },
    galleryViewAll: 'Ver galería completa',
    galleryPhotosLabel: 'fotografías reales',
    planVisit: 'Planear mi visita',
    includedEyebrow: 'Qué incluye',
    includedTitle: 'Todo lo necesario para una experiencia cómoda, segura y memorable.',
    included: [
      'Guía local con conocimiento de comportamiento de aves',
      'Acceso a senderos y puntos de observación de La Vieja Adventures',
      'Interpretación ambiental de bosque, clima y biodiversidad',
      'Paradas estratégicas para fotografía y uso de binoculares',
      'Recomendaciones antes del tour para ropa, equipo y seguridad',
      'Opciones privadas para parejas, familias y grupos pequeños',
    ],
    conversionEyebrow: 'Mejor conversión',
    conversionTitle: 'Reserva temprano. El bosque se despierta antes que el sol.',
    conversionDescription:
      'Las primeras horas ofrecen mejor luz, menos calor y mayor actividad de aves. Recomendamos confirmar disponibilidad con anticipación.',
    reserveNow: 'Reservar ahora',
    faqEyebrow: 'FAQ',
    faqTitle: 'Preguntas frecuentes antes de reservar.',
    faqs: [
      {
        q: '¿Necesito experiencia previa?',
        a: 'No. Adaptamos la experiencia a principiantes, familias, fotógrafos y observadores avanzados.',
      },
      {
        q: '¿Se garantizan especies específicas?',
        a: 'La naturaleza no se garantiza. Sí optimizamos hora, ruta y silencio para aumentar la probabilidad de avistamientos memorables.',
      },
      {
        q: '¿Qué debo llevar?',
        a: 'Zapatos cerrados, ropa de colores naturales, impermeable ligero, agua, repelente, binoculares si tienes y cámara opcional.',
      },
      {
        q: '¿Cuál es el mejor horario?',
        a: 'Recomendamos salir entre 5:30 a.m. y 6:00 a.m., cuando las aves están más activas y la luz es ideal.',
      },
    ],
    bookingEyebrow: 'Reserva directa',
    bookingTitle: '¿Listo para escuchar el bosque despertar?',
    bookingDescription:
      'Escríbenos por WhatsApp para confirmar fecha, horario, modalidad, nivel físico y necesidades de fotografía. Te responderemos con una recomendación personalizada.',
    email: 'Enviar email',
    bookingImageAlt: 'Experiencia de birdwatching en bosque tropical de Costa Rica',
    footerDescription:
      'Turismo de naturaleza, observación de aves, senderismo, fotografía y experiencias rurales auténticas en Sucre, San Carlos, Costa Rica.',
    explore: 'Explorar',
    footerContact: 'Contacto',
    copyright: '© 2026 La Vieja Adventures. Experiencias de turismo responsable en Costa Rica.',
    photoCreditPrefix: 'Fotografías tomadas en La Vieja Adventures y enlazadas desde ',
    photoCreditSuffix: ' como material visual propio del repositorio.',
    schemaDescription:
      'Experiencias guiadas de observación de aves, fotografía de naturaleza y turismo rural auténtico en Sucre, San Carlos, Costa Rica.',
    schemaTouristType: ['Birdwatchers', 'Fotógrafos de naturaleza', 'Familias', 'Viajeros eco'],
  },
  en: {
    languageName: 'English',
    languageToggle: 'Español',
    languageToggleAria: 'Switch language to Spanish',
    whatsappMessage:
      'Hello La Vieja Adventures, I would like to book a Birdwatching experience. Could you share availability and options?',
    navAria: 'Main navigation',
    homeAria: 'La Vieja Adventures Birdwatching home',
    menu: 'Menu',
    openMobileMenu: 'Open mobile menu',
    skipLink: 'Skip to main content',
    navItems: [
      { label: 'Experiences', href: '#experiencias' },
      { label: 'Gallery', href: '#galeria' },
      { label: 'Birds of the month', href: '#aves-destacadas' },
      { label: 'Tour checklist', href: '/birdwatching/checklist' },
      { label: 'Reviews', href: '/reviews' },
      { label: 'Includes', href: '#incluye' },
      { label: 'FAQ', href: '#faq' },
    ],
    reserve: 'Book',
    reserveTour: 'Book Tour',
    contact: 'Contact',
    seeExperiences: 'See Experiences',
    reserveWhatsapp: 'Book on WhatsApp',
    keyFactsAria: 'Key tour facts',
    heroEyebrow: 'Premium birdwatching in Costa Rica',
    heroTitle: 'La Vieja Adventures Birdwatching',
    heroDescription:
      'Observe, photograph, and connect with the biodiversity of Sucre, San Carlos, through a guided experience led by locals who understand the rhythms of the tropical forest.',
    recommendedEyebrow: 'Recommended experience',
    recommendedTitle: 'Sunrise Birdwatching + Local Coffee',
    recommendedDescription:
      'An early-morning departure, private trails, ethical photography, and a closing moment with Costa Rican coffee.',
    benefits: [
      { value: '120+', label: 'potential species in the area' },
      { value: '5:30', label: 'recommended departure time' },
      { value: '100%', label: 'authentic local experience' },
      { value: 'Low', label: 'environmental impact tour' },
    ],
    highlightsAria: 'Featured benefits',
    highlights: ['Expert local guides', 'Fast reservations via WhatsApp', 'Low-impact rural tourism'],
    checklistEyebrow: 'New · During the tour',
    checklistTitle: 'Take your bird checklist on the trail',
    checklistDescription:
      'As you walk the trails, mark every bird you see, hear, or photograph right from your phone. Your progress saves automatically and you can download a digital keepsake of your experience at the end.',
    checklistFeatures: ['Built for your phone', 'Saves your progress automatically', 'Download your keepsake as image or PDF'],
    checklistCta: 'Open the tour checklist',
    checklistHint: 'Free · no sign-up',
    checklistNav: 'Checklist',
    introEyebrow: 'Nature, adventure, and authenticity',
    introTitle: 'An experience designed to see more than birds.',
    introParagraphs: [
      'La Vieja Adventures turns birdwatching into a calm, premium immersion: slow-paced trails, landscape reading, environmental interpretation, and unhurried spaces for photography.',
      'The experience is designed for travelers seeking the real Costa Rica: biodiversity, local knowledge, rural hospitality, and a memorable adventure far from mass tourism.',
    ],
    experiencesEyebrow: 'Tour options',
    experiencesTitle: 'Choose the ideal route for the way you explore.',
    experiences: [
      {
        title: 'Classic Birdwatching',
        eyebrow: 'Ideal for getting started',
        duration: '2.5–3 hours',
        copy: 'A guided walk through trails, observation stations, and high-activity points to discover local species with naturalist interpretation.',
        points: ['Expert local guide', 'Bird checklist', 'Family-friendly pace'],
      },
      {
        title: 'Bird Photography Tour',
        eyebrow: 'For photographers',
        duration: '3.5–4 hours',
        copy: 'A route designed around light, patience, composition, and ethical behavior to capture birds without disturbing their environment.',
        points: ['Sunrise light', 'Extended pauses', 'Technical tips'],
      },
      {
        title: 'Sunrise + Local Coffee',
        eyebrow: 'Most booked',
        duration: '5:30 a.m.',
        copy: 'Experience the forest at its most active in the early hours and close the morning with Costa Rican coffee and local conversation.',
        points: ['Active birds', 'Local coffee', 'Premium atmosphere'],
      },
      {
        title: 'Private Birding Experience',
        eyebrow: 'Exclusive',
        duration: 'Flexible',
        copy: 'A private experience for couples, families, or small groups, adjusted to your interests, fitness level, and photography goals.',
        points: ['Personalized route', '1:1 attention', 'Flexible scheduling'],
      },
    ],
    checkAvailability: 'Check availability →',
    galleryEyebrow: 'Visual gallery',
    galleryTitle: 'Real photos taken at La Vieja Adventures.',
    galleryDescription:
      'All photos were captured at La Vieja Adventures, the place where the birdwatching and nature photography tour takes place. Tap any image to view it larger.',
    galleryUi: {
      open: 'Enlarge image',
      close: 'Close',
      prev: 'Previous image',
      next: 'Next image',
      viewer: 'Gallery viewer',
      of: 'of',
    },
    galleryViewAll: 'View full gallery',
    galleryPhotosLabel: 'real photos',
    planVisit: 'Plan my visit',
    includedEyebrow: 'What is included',
    includedTitle: 'Everything needed for a comfortable, safe, and memorable experience.',
    included: [
      'Local guide with knowledge of bird behavior',
      'Access to La Vieja Adventures trails and observation points',
      'Environmental interpretation of forest, climate, and biodiversity',
      'Strategic stops for photography and binocular use',
      'Pre-tour recommendations for clothing, gear, and safety',
      'Private options for couples, families, and small groups',
    ],
    conversionEyebrow: 'Best timing',
    conversionTitle: 'Book early. The forest wakes before the sun.',
    conversionDescription:
      'The first hours offer better light, less heat, and more bird activity. We recommend confirming availability in advance.',
    reserveNow: 'Book now',
    faqEyebrow: 'FAQ',
    faqTitle: 'Frequently asked questions before booking.',
    faqs: [
      {
        q: 'Do I need previous experience?',
        a: 'No. We adapt the experience for beginners, families, photographers, and advanced birdwatchers.',
      },
      {
        q: 'Are specific species guaranteed?',
        a: 'Nature cannot be guaranteed. We optimize timing, route, and silence to increase the chance of memorable sightings.',
      },
      {
        q: 'What should I bring?',
        a: 'Closed-toe shoes, natural-colored clothing, a light rain jacket, water, repellent, binoculars if you have them, and an optional camera.',
      },
      {
        q: 'What is the best time?',
        a: 'We recommend departing between 5:30 a.m. and 6:00 a.m., when birds are more active and the light is ideal.',
      },
    ],
    bookingEyebrow: 'Direct booking',
    bookingTitle: 'Ready to hear the forest wake up?',
    bookingDescription:
      'Message us on WhatsApp to confirm date, time, tour option, fitness level, and photography needs. We will reply with a personalized recommendation.',
    email: 'Send email',
    bookingImageAlt: 'Birdwatching experience in a tropical forest in Costa Rica',
    footerDescription:
      'Nature tourism, birdwatching, hiking, photography, and authentic rural experiences in Sucre, San Carlos, Costa Rica.',
    explore: 'Explore',
    footerContact: 'Contact',
    copyright: '© 2026 La Vieja Adventures. Responsible tourism experiences in Costa Rica.',
    photoCreditPrefix: 'Photos taken at La Vieja Adventures and linked from ',
    photoCreditSuffix: ' as visual material owned by this repository.',
    schemaDescription:
      'Guided birdwatching, nature photography, and authentic rural tourism experiences in Sucre, San Carlos, Costa Rica.',
    schemaTouristType: ['Birdwatchers', 'Nature photographers', 'Families', 'Eco travelers'],
  },
};

export default function Home() {
  const [language, setLanguage] = useState<Language>('es');
  const t = content[language];
  const nextLanguage = language === 'es' ? 'en' : 'es';

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const whatsappUrl = useMemo(() => whatsappLink(t.whatsappMessage), [t.whatsappMessage]);

  const gallery: GalleryImage[] = useMemo(
    () =>
      galleryImages.map((image) => ({
        src: birdwatchingImage(image.file),
        alt: image[language].alt,
        label: image[language].label,
        scientificName: image.scientificName,
      })),
    [language]
  );

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'TouristTrip',
      name: 'La Vieja Adventures Birdwatching',
      description: t.schemaDescription,
      touristType: t.schemaTouristType,
      provider: {
        '@type': 'LocalBusiness',
        name: siteConfig.name,
        address: siteConfig.location,
        telephone: siteConfig.phoneDisplay,
        email: siteConfig.email,
        areaServed: 'Costa Rica',
      },
      location: {
        '@type': 'Place',
        name: 'Sucre, San Carlos, Costa Rica',
      },
    }),
    [t.schemaDescription, t.schemaTouristType]
  );

  return (
    <main className="site-shell overflow-hidden bg-[#f8f3e8] text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <a href="#contenido" className="skip-link">
        {t.skipLink}
      </a>

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[#07180f]/80 text-white shadow-2xl shadow-black/10 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label={t.navAria}>
          <a href="#inicio" className="group flex items-center gap-3 text-white" aria-label={t.homeAria}>
            <span className="grid h-11 w-11 place-items-center overflow-hidden rounded-full border border-emerald-200/30 bg-[#f8f3e8] shadow-inner shadow-white/10 transition-transform group-hover:scale-105">
              <Image
                src="/logo-emblem.jpeg"
                alt="La Vieja Adventures Birdwatching"
                width={44}
                height={44}
                className="h-full w-full object-cover"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-bold uppercase tracking-[0.22em] text-emerald-100">La Vieja</span>
              <span className="block font-serif text-lg font-bold tracking-tight">Adventures</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {t.navItems.map((item) => (
              <a key={item.href} href={item.href} className="text-sm font-semibold text-white/80 transition hover:text-white">
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLanguage(nextLanguage)}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-amber-200"
              aria-label={t.languageToggleAria}
              aria-live="polite"
            >
              {t.languageToggle}
            </button>
            <a href={whatsappUrl} className="btn btn-small hidden sm:inline-flex" target="_blank" rel="noreferrer">
              {t.reserve}
            </a>
            <details className="mobile-menu lg:hidden">
              <summary aria-label={t.openMobileMenu}>{t.menu}</summary>
              <div className="absolute right-4 top-16 w-[min(22rem,calc(100vw-2rem))] rounded-3xl border border-white/15 bg-[#07180f] p-4 shadow-2xl">
                {t.navItems.map((item) => (
                  <a key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 font-semibold text-white/85 hover:bg-white/10 hover:text-white">
                    {item.label}
                  </a>
                ))}
                <a href={whatsappUrl} className="btn mt-3 w-full justify-center" target="_blank" rel="noreferrer">
                  {t.reserveWhatsapp}
                </a>
              </div>
            </details>
          </div>
        </nav>
      </header>

      <section id="inicio" className="hero relative isolate min-h-[100svh] overflow-hidden text-white">
        <Image
          src={heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-20 object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_25%,rgba(217,171,83,.28),transparent_34%),linear-gradient(90deg,rgba(4,18,12,.95),rgba(4,18,12,.67)_42%,rgba(4,18,12,.18))]" />

        <div id="contenido" className="mx-auto grid min-h-[100svh] max-w-7xl items-center px-4 pb-20 pt-32 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
          <div className="max-w-3xl reveal">
            <p className="eyebrow text-emerald-100">{t.heroEyebrow}</p>
            <h1 className="mt-5 font-serif text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/86 sm:text-xl">
              {t.heroDescription}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={whatsappUrl} className="btn" target="_blank" rel="noreferrer">
                {t.reserveTour}
              </a>
              <a href="#contacto" className="btn btn-ghost">
                {t.contact}
              </a>
              <a href="#experiencias" className="btn btn-glass">
                {t.seeExperiences}
              </a>
            </div>
          </div>

          <aside className="mt-12 grid gap-4 lg:mt-0 reveal reveal-delay" aria-label={t.keyFactsAria}>
            <div className="premium-card bg-white/12 text-white backdrop-blur-md">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-100">{t.recommendedEyebrow}</p>
              <h2 className="mt-3 font-serif text-3xl font-bold">{t.recommendedTitle}</h2>
              <p className="mt-4 text-white/78">{t.recommendedDescription}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {t.benefits.map((item) => (
                <div key={item.label} className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                  <strong className="block font-serif text-3xl text-amber-200">{item.value}</strong>
                  <span className="mt-2 block text-sm text-white/76">{item.label}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="relative z-10 -mt-10 px-4 sm:px-6 lg:px-8" aria-label={t.highlightsAria}>
        <div className="mx-auto grid max-w-7xl gap-4 rounded-[2rem] border border-emerald-950/10 bg-white p-4 shadow-2xl shadow-emerald-950/10 md:grid-cols-3">
          {t.highlights.map((item) => (
            <div key={item} className="flex items-center gap-4 rounded-[1.5rem] bg-emerald-50 p-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-emerald-900 text-amber-200">✓</span>
              <p className="font-bold text-emerald-950">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="intro-title">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="reveal">
              <p className="eyebrow text-emerald-900">{t.introEyebrow}</p>
              <h2 id="intro-title" className="section-title">{t.introTitle}</h2>
              <div className="mt-6 space-y-5 text-lg leading-8 text-slate-700">
                {t.introParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div
              id="checklist-cta"
              className="reveal reveal-delay relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-500 via-emerald-600 to-emerald-800 p-8 text-white shadow-2xl shadow-emerald-900/30 sm:p-10"
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full bg-amber-200/25 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -bottom-16 left-8 h-64 w-64 rounded-full bg-teal-200/20 blur-3xl" aria-hidden="true" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-amber-100 backdrop-blur-sm">
                  <span aria-hidden="true">🪶</span>
                  {t.checklistEyebrow}
                </span>
                <h3 className="mt-5 font-serif text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                  {t.checklistTitle}
                </h3>
                <p className="mt-4 text-lg leading-8 text-white/85">{t.checklistDescription}</p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-white/90">
                  {t.checklistFeatures.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-200 text-xs text-emerald-950" aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-col items-start gap-3">
                  <a href="/birdwatching/checklist" className="btn group w-full justify-center text-base sm:w-auto">
                    <span aria-hidden="true" className="transition-transform group-hover:-translate-x-0.5">✓</span>
                    {t.checklistCta}
                    <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
                  </a>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">{t.checklistHint}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="experiencias" className="section relative overflow-hidden bg-[#07180f] text-white" aria-labelledby="experiences-title">
        {/* Foto real de la galería como textura de fondo (oscurecida para legibilidad). */}
        <Image
          src={birdwatchingImage('8a916eb1-9ac7-4eef-9ca5-4e7fca45fbe7.jpeg')}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#07180f]/88" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f8f3e8] to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center reveal">
            <p className="eyebrow text-amber-200">{t.experiencesEyebrow}</p>
            <h2 id="experiences-title" className="section-title text-white">{t.experiencesTitle}</h2>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {t.experiences.map((experience) => (
              <article key={experience.title} className="experience-card reveal">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-200">{experience.eyebrow}</p>
                <h3 className="mt-4 font-serif text-2xl font-bold">{experience.title}</h3>
                <p className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-emerald-100">{experience.duration}</p>
                <p className="mt-5 text-sm leading-7 text-white/72">{experience.copy}</p>
                <ul className="mt-6 space-y-3">
                  {experience.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm text-white/82">
                      <span className="text-amber-200">✦</span>
                      {point}
                    </li>
                  ))}
                </ul>
                <a href={whatsappUrl} className="mt-8 inline-flex font-bold text-amber-200 hover:text-white" target="_blank" rel="noreferrer">
                  {t.checkAvailability}
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="galeria" className="section relative overflow-hidden bg-[#07180f] text-white" aria-labelledby="gallery-title">
        <Image
          src={birdwatchingImage('b8cd51a3-ba04-4c29-88ba-fa3b88e07bf3.jpeg')}
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#07180f]/85" aria-hidden="true" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-amber-100 backdrop-blur-sm">
            <span aria-hidden="true">📸</span>
            {t.galleryEyebrow}
          </span>
          <h2 id="gallery-title" className="mt-6 section-title text-white">{t.galleryTitle}</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">{t.galleryDescription}</p>
          <Link
            href="/galeria"
            className="group mt-9 inline-flex items-center gap-3 rounded-full bg-amber-200 px-8 py-4 text-base font-black uppercase tracking-[0.12em] text-emerald-950 shadow-lg shadow-amber-900/20 transition duration-300 hover:scale-[1.03] hover:bg-amber-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            {t.galleryViewAll}
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
          <span className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100/80">
            {gallery.length} {t.galleryPhotosLabel}
          </span>
        </div>
      </section>

      <MonthlyFeaturedBirds language={language} whatsappNumber={whatsappNumber} variant="cta" />

      <section id="incluye" className="section bg-white" aria-labelledby="included-title">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:px-8">
          <div className="reveal">
            <p className="eyebrow text-emerald-900">{t.includedEyebrow}</p>
            <h2 id="included-title" className="section-title">{t.includedTitle}</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.included.map((item) => (
                <div key={item} className="rounded-3xl border border-emerald-950/10 bg-[#f8f3e8] p-5 shadow-sm">
                  <span className="text-emerald-900">✓</span>
                  <p className="mt-3 font-semibold leading-7 text-slate-800">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="premium-card sticky top-28 h-fit bg-emerald-950 text-white reveal reveal-delay">
            <p className="eyebrow text-amber-200">{t.conversionEyebrow}</p>
            <h3 className="mt-4 font-serif text-4xl font-bold">{t.conversionTitle}</h3>
            <p className="mt-5 leading-7 text-white/76">{t.conversionDescription}</p>
            <a href={whatsappUrl} className="btn mt-8" target="_blank" rel="noreferrer">
              {t.reserveNow}
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="section" aria-labelledby="faq-title">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center reveal">
            <p className="eyebrow text-emerald-900">{t.faqEyebrow}</p>
            <h2 id="faq-title" className="section-title">{t.faqTitle}</h2>
          </div>
          <div className="mt-10 space-y-4">
            {t.faqs.map((faq) => (
              <details key={faq.q} className="faq-item reveal">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="contacto" className="px-4 pb-20 sm:px-6 lg:px-8" aria-labelledby="booking-title">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#07180f] text-white shadow-2xl shadow-emerald-950/20">
          <div className="grid lg:grid-cols-[1.1fr_.9fr]">
            <div className="p-8 sm:p-12 lg:p-16 reveal">
              <p className="eyebrow text-amber-200">{t.bookingEyebrow}</p>
              <h2 id="booking-title" className="font-serif text-4xl font-black tracking-tight sm:text-5xl">{t.bookingTitle}</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">{t.bookingDescription}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a href={whatsappUrl} className="btn" target="_blank" rel="noreferrer">
                  {t.reserveWhatsapp}
                </a>
                <a href={`mailto:${siteConfig.email}`} className="btn btn-ghost">
                  {t.email}
                </a>
              </div>
            </div>
            <div className="relative min-h-[24rem]">
              <Image
                src={birdwatchingImage('5207a9ea-d688-41a7-a4b8-4ab7c0e37ecc.jpeg')}
                alt={t.bookingImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07180f] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#04120c] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/logo-emblem.jpeg"
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-full border border-white/15 bg-[#f8f3e8] object-cover"
              />
              <p className="font-serif text-2xl font-bold">La Vieja Adventures Birdwatching</p>
            </div>
            <p className="mt-4 max-w-xl leading-7 text-white/62">{t.footerDescription}</p>
          </div>
          <div>
            <h3 className="font-bold text-amber-200">{t.explore}</h3>
            <ul className="mt-4 space-y-3 text-white/70">
              {t.navItems.map((item) => (
                <li key={item.href}><a href={item.href} className="hover:text-white">{item.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-amber-200">{t.footerContact}</h3>
            <address className="mt-4 space-y-3 not-italic text-white/70">
              <p>{siteConfig.location}</p>
              <a href={whatsappUrl} className="block hover:text-white" target="_blank" rel="noreferrer">WhatsApp: {siteConfig.phoneDisplay}</a>
              <a href={`mailto:${siteConfig.email}`} className="block hover:text-white">{siteConfig.email}</a>
            </address>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 pt-6 text-sm text-white/45">
          {t.copyright}
        </div>
        <p className="mx-auto mt-4 max-w-7xl text-xs text-white/45">
          {t.photoCreditPrefix}
          <code>/public/images/birdwatching</code>
          {t.photoCreditSuffix}
        </p>
      </footer>

      <a href={whatsappUrl} className="floating-whatsapp" target="_blank" rel="noreferrer" aria-label={t.reserveWhatsapp}>
        <span aria-hidden="true">✆</span>
        <span>{t.reserve}</span>
      </a>
    </main>
  );
}

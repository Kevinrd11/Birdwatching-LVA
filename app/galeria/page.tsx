import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { galleryImages, birdwatchingImage } from '@/data/galleryImages';

export const metadata: Metadata = {
  title: 'Galería de fotos',
  description:
    'Galería completa de fotografías reales tomadas en La Vieja Adventures durante el tour de birdwatching y fotografía de naturaleza en Sucre, San Carlos, Costa Rica.',
  alternates: { canonical: '/galeria' },
};

export default function GaleriaPage() {
  return (
    <main className="min-h-screen bg-[#f8f3e8] text-slate-950">
      <header className="border-b border-emerald-950/10 bg-[#07180f] text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="group flex items-center gap-3" aria-label="La Vieja Adventures inicio">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-emerald-200/30 bg-[#f8f3e8]">
              <Image
                src="/logo-emblem.jpeg"
                alt="La Vieja Adventures Birdwatching"
                width={40}
                height={40}
                className="h-full w-full object-cover"
                priority
              />
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-emerald-100">La Vieja</span>
              <span className="block font-serif text-base font-bold tracking-tight">Birdwatching LVA</span>
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-white/20"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <div className="text-center">
          <p className="eyebrow text-teal-700">Birdwatching LVA · Galería visual</p>
          <h1 className="section-title mx-auto max-w-3xl text-4xl sm:text-5xl">Fotos reales tomadas en La Vieja Adventures.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Todas las fotografías fueron capturadas en La Vieja Adventures, el lugar donde se desarrolla el tour de
            birdwatching y fotografía de naturaleza.
          </p>
        </div>

        {/* Mismo estilo de tarjetas que la sección de aves destacadas del mes. */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image, index) => (
            <article
              key={image.file}
              className="group overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-white text-slate-950 shadow-2xl shadow-emerald-950/10"
            >
              <div className="relative h-56 overflow-hidden bg-emerald-950">
                <Image
                  src={birdwatchingImage(image.file)}
                  alt={image.es.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                  priority={index < 3}
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/92 px-3 py-1 text-xs font-black uppercase tracking-[0.14em] text-emerald-950 shadow-lg backdrop-blur-sm">
                  Foto LVA
                </span>
              </div>

              <div className="p-6">
                <h3 className="font-serif text-2xl font-black tracking-tight text-emerald-950">{image.es.label}</h3>
                {image.scientificName && (
                  <p className="mt-2 text-sm italic text-emerald-800">{image.scientificName}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="bg-[#04120c] px-4 py-8 text-center text-sm text-white/55 sm:px-6">
        <p className="font-serif text-lg font-bold text-white">La Vieja Adventures</p>
        <p className="mt-2">Sucre, San Carlos, Costa Rica · Birdwatching LVA</p>
      </footer>
    </main>
  );
}

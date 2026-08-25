import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Gallery from '@/components/Gallery';
import { galleryImageCredit, galleryImagePath, galleryImages } from '@/data/galleryImages';

export const metadata: Metadata = {
  title: 'Galería de fotos',
  description:
    'Galería completa de fotografías reales tomadas en La Vieja Adventures durante el tour de birdwatching y fotografía de naturaleza en Sucre, San Carlos, Costa Rica.',
  alternates: { canonical: '/galeria' },
};

export default function GaleriaPage() {
  const images = galleryImages.map((image) => ({
    src: galleryImagePath(image),
    alt: image.es.alt,
    label: image.es.label,
    credit: galleryImageCredit(image),
    scientificName: image.scientificName,
  }));

  return (
    <main className="min-h-screen bg-[#f8f3e8] text-slate-950">
      <header className="border-b border-white/10 bg-[#07180f] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="La Vieja Adventures inicio">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/20 bg-[#f8f3e8]">
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
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">La Vieja</span>
              <span className="block font-serif text-base font-semibold tracking-tight">Birdwatching LVA</span>
            </span>
          </Link>
          <Link
            href="/"
            className="text-link text-link-light text-sm"
          >
            ← Inicio
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-24">
        <div className="max-w-3xl reveal">
          <p className="eyebrow text-emerald-800">Birdwatching LVA · Galería</p>
          <h1 className="section-title max-w-3xl">Fotos reales tomadas en La Vieja Adventures.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            Todas las fotografías fueron capturadas en La Vieja Adventures, el lugar donde se desarrolla el tour de
            birdwatching y fotografía de naturaleza.
          </p>
        </div>

        <Gallery
          images={images}
          ui={{
            open: 'Abrir foto',
            close: 'Cerrar',
            prev: 'Foto anterior',
            next: 'Foto siguiente',
            viewer: 'Visor de galería',
            of: 'de',
          }}
        />
      </section>

      <footer className="bg-[#04120c] px-4 py-8 text-center text-sm text-white/55 sm:px-6">
        <p className="font-serif text-lg font-semibold text-white">La Vieja Adventures</p>
        <p className="mt-2">Sucre, San Carlos, Costa Rica · Birdwatching LVA</p>
        <p className="mt-4 text-xs text-white/35">Diseño y desarrollo por Kevin Rojas Durán</p>
      </footer>
    </main>
  );
}

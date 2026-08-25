import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { reviews } from '@/data/reviews';

export const metadata: Metadata = {
  title: 'Reviews de visitantes',
  description:
    'Lo que dicen los visitantes sobre las experiencias de birdwatching, fotografía de naturaleza y turismo rural en La Vieja Adventures, Sucre, San Carlos, Costa Rica.',
  alternates: { canonical: '/reviews' },
};

export default function ReviewsPage() {
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
          <p className="eyebrow text-emerald-800">Birdwatching LVA · Confianza</p>
          <h1 className="section-title max-w-3xl">Visitantes que buscan naturaleza real, no tours genéricos.</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-600">
            Estas son algunas de las experiencias que han compartido quienes nos acompañaron en los senderos, miradores
            y bosques de La Vieja Adventures.
          </p>
        </div>

        <div className="reveal mt-16 grid border-t border-emerald-950/15 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.author} className="border-b border-emerald-950/15 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
              <p className="font-serif text-xl leading-8 text-slate-700">“{review.quote.es}”</p>
              <footer className="mt-7 border-t border-emerald-950/10 pt-5">
                <strong className="block text-emerald-950">{review.author}</strong>
                <span className="text-sm text-slate-500">{review.detail.es}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <footer className="bg-[#04120c] px-4 py-8 text-center text-sm text-white/55 sm:px-6">
        <p className="font-serif text-lg font-semibold text-white">La Vieja Adventures</p>
        <p className="mt-2">Sucre, San Carlos, Costa Rica · Birdwatching LVA</p>
        <p className="mt-4 text-xs text-white/35">Diseño y desarrollo por Kevin Rojas Durán</p>
      </footer>
    </main>
  );
}

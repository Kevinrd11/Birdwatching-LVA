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
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-teal-700">Birdwatching LVA · Confianza</p>
          <h1 className="section-title mx-auto max-w-3xl text-4xl sm:text-5xl">Visitantes que buscan naturaleza real, no tours genéricos.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Estas son algunas de las experiencias que han compartido quienes nos acompañaron en los senderos, miradores
            y bosques de La Vieja Adventures.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <blockquote key={review.author} className="rounded-[2rem] bg-white p-8 shadow-xl shadow-emerald-950/5">
              <p className="text-lg leading-8 text-slate-700">“{review.quote.es}”</p>
              <footer className="mt-6 border-t border-emerald-950/10 pt-5">
                <strong className="block text-emerald-950">{review.author}</strong>
                <span className="text-sm text-slate-500">{review.detail.es}</span>
              </footer>
            </blockquote>
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

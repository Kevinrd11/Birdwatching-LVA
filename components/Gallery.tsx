'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type GalleryImage = {
  src: string;
  alt: string;
  label: string;
  credit?: string;
  scientificName?: string;
};

export type GalleryUiLabels = {
  open: string;
  close: string;
  prev: string;
  next: string;
  viewer: string;
  of: string; // conector para el contador, p. ej. "de" -> "3 de 13"
};

type GalleryProps = {
  images: GalleryImage[];
  ui: GalleryUiLabels;
};

export default function Gallery({ images, ui }: GalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const isOpen = openIndex !== null;

  const triggerRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const touchStartX = useRef<number | null>(null);

  const open = useCallback((index: number) => {
    triggerRef.current = document.activeElement as HTMLElement | null;
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus?.();
  }, []);

  const showPrev = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const showNext = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % images.length));
  }, [images.length]);

  // Navegación por teclado y bloqueo de scroll de fondo mientras el visor está abierto.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') showPrev();
      else if (event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, close, showPrev, showNext]);

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta < 0) showNext();
      else showPrev();
    }
    touchStartX.current = null;
  };

  const active = isOpen ? images[openIndex] : null;
  const activeNumber = (openIndex ?? 0) + 1;

  return (
    <>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {images.map((image, index) => (
          <li key={image.src} className="reveal">
            <button
              type="button"
              onClick={() => open(index)}
              aria-label={`${ui.open}: ${image.label}`}
              aria-haspopup="dialog"
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-[#edf3e6] shadow-xl shadow-emerald-950/10 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-contain p-3 transition duration-500 group-hover:scale-[1.02]"
                priority={index < 3}
              />
              <span
                className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-emerald-950/78 via-emerald-950/24 to-transparent"
                aria-hidden="true"
              />
              <span className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 text-left">
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight text-white drop-shadow-sm">{image.label}</span>
                  {image.scientificName && (
                    <span className="block text-xs font-semibold italic text-amber-200/90">{image.scientificName}</span>
                  )}
                </span>
                {image.credit && (
                  <span className="shrink-0 pb-0.5 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/70 drop-shadow-[0_2px_6px_rgba(0,0,0,.9)]">
                    {image.credit}
                  </span>
                )}
              </span>
              <span
                className="pointer-events-none absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-lg text-emerald-950 opacity-0 shadow-lg transition duration-300 group-hover:opacity-100"
                aria-hidden="true"
              >
                ⤢
              </span>
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={ui.viewer}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#04120c]/92 p-4 backdrop-blur-sm sm:p-6"
          onClick={close}
        >
          <p className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold text-white">
            {activeNumber} {ui.of} {images.length}
          </p>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label={ui.close}
            className="absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-3xl leading-none text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            ×
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            aria-label={ui.prev}
            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl leading-none text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 sm:left-6"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label={ui.next}
            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-3xl leading-none text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300 sm:right-6"
          >
            ›
          </button>

          <figure
            className="flex h-full w-full max-w-5xl flex-col items-center justify-center"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative min-h-0 w-full flex-1">
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-contain p-2"
                priority
              />
              {active.credit && (
                <span className="pointer-events-none absolute bottom-4 right-4 text-xs font-black uppercase tracking-[0.16em] text-white/65 drop-shadow-[0_2px_8px_rgba(0,0,0,.95)] sm:text-sm">
                  {active.credit}
                </span>
              )}
            </div>
            <figcaption className="mt-4 shrink-0 text-center">
              <span className="block text-lg font-black text-white">{active.label}</span>
              {active.scientificName && (
                <span className="block text-sm font-semibold italic text-amber-200">{active.scientificName}</span>
              )}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

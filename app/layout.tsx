import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '900'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://lavieja-adventures.com'),
  title: {
    default: 'La Vieja Adventures Birdwatching | Tours de aves en Costa Rica',
    template: '%s | La Vieja Adventures',
  },
  description:
    'Reserva experiencias premium de birdwatching, fotografía de naturaleza, senderismo y turismo rural auténtico en Sucre, San Carlos, Costa Rica.',
  keywords: [
    'La Vieja Adventures Birdwatching',
    'birdwatching Costa Rica',
    'observación de aves San Carlos',
    'fotografía de aves Costa Rica',
    'turismo de naturaleza Costa Rica',
    'ecoturismo Sucre San Carlos',
    'tours privados de aves Costa Rica',
  ],
  applicationName: 'La Vieja Adventures Birdwatching',
  authors: [{ name: 'La Vieja Adventures' }],
  creator: 'La Vieja Adventures',
  publisher: 'La Vieja Adventures',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'La Vieja Adventures Birdwatching',
    description:
      'Experiencias guiadas de observación de aves, fotografía de naturaleza y aventura rural en Sucre, San Carlos, Costa Rica.',
    url: 'https://lavieja-adventures.com',
    siteName: 'La Vieja Adventures',
    locale: 'es_CR',
    type: 'website',
    images: [
      {
        url: '/logo.jpeg',
        width: 1024,
        height: 559,
        alt: 'Logo de La Vieja Adventures Birdwatching — Sucre, San Carlos, Costa Rica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Vieja Adventures Birdwatching',
    description: 'Tours premium de observación de aves y fotografía de naturaleza en Costa Rica.',
    images: ['/logo.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CR" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

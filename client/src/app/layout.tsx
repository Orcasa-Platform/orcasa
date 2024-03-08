import '@/styles/globals.css';

import { Suspense } from 'react';

import { Roboto_Slab, Roboto } from 'next/font/google';

import { Metadata } from 'next';

import { cn } from '@/lib/classnames';

import Providers from '@/app/layout-providers';

import DefaultBasemap from '@/containers/default-basemap';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-roboto',
});

const robotoSlab = Roboto_Slab({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-roboto-slab',
});

const DESCRIPTION =
  'Powered by the Soil Carbon International Research Consortium, Impact4soil offers data and meta-analysis on soil carbon, practices, and land management solutions.';

export const metadata: Metadata = {
  title: { template: 'Impact4Soil - %s', default: 'Impact4Soil' },
  description: DESCRIPTION,
  keywords: 'Impact4Soil, ORCaSa, Horizon Europe, carbon capture, climate change',
  robots: 'index, follow',
  authors: { name: 'Vizzuality', url: 'https://vizzuality.com' },
  ...(process.env.NEXT_PUBLIC_ENABLE_RESPONSIVE !== 'true'
    ? {
        viewport: {
          width: 1200,
        },
      }
    : {}),
  openGraph: {
    title: 'Impact4Soil - Horizon Europe Initiative',
    description: DESCRIPTION,
    type: 'website',
    url: 'https://impact4soil.com/',
    locale: 'en_US',
    images: [{ url: '/metadata/1200x630.png' }],
    siteName: 'ORCaSa',
  },
  twitter: {
    card: 'summary_large_image',
    images: '/metadata/1200x630.png',
    title: 'ORCaSa',
    description: DESCRIPTION,
    site: '@IRC_ORCaSa',
    creator: '@Vizzuality',
  },
  themeColor: '#ffffff',
  metadataBase: new URL('https://impact4soil.com/'),
  alternates: {
    canonical: `/`,
  },
  manifest: '/metadata/manifest.json',
  icons: {
    icon: '/metadata/favicon_48x48.png',
    apple: '/metadata/apple-touch-icon-180x180.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={cn(
            roboto.variable,
            robotoSlab.variable,
            'overflow-hidden font-sans text-default',
          )}
        >
          {/* Use suspense to render client component without deopting pages
          https://nextjs.org/docs/messages/deopted-into-client-rendering */}
          <Suspense fallback={null}>
            <DefaultBasemap />
          </Suspense>
          {children}
        </body>
      </html>
    </Providers>
  );
}

import '@/styles/globals.css';

import { Suspense } from 'react';

import { Roboto_Slab, Roboto } from 'next/font/google';

import { Metadata } from 'next';

import { cn } from '@/lib/classnames';

import Providers from '@/app/layout-providers';

import DefaultBasemap from '@/containers/default-basemap';

import MobileMenu from '@/components/mobile-menu';

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
console.log(process.env.NEXT_PUBLIC_ENABLE_RESPONSIVE);
export const metadata: Metadata = {
  title: { template: 'Impact4Soil - %s', default: 'Impact4Soil' },
  description:
    'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil.',
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
    // TODO: update description
    description:
      'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil.',
    type: 'website',
    // TODO: update url
    url: 'https://irc-orcasa.eu/',
    locale: 'en_US',
    images: [{ url: '/metadata/1200x630.png' }],
    siteName: 'ORCaSa',
  },
  twitter: {
    card: 'summary_large_image',
    images: '/metadata/1200x630.png',
    title: 'ORCaSa',
    // TODO: update description
    description:
      'ORCaSa is a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil.',
    site: '@IRC_ORCaSa',
    creator: '@Vizzuality',
  },
  themeColor: '#ffffff',
  // TODO: update url
  metadataBase: new URL('https://irc-orcasa.eu/'),
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
          <MobileMenu />
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

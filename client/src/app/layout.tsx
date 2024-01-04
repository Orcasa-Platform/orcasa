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

// TODO: Update metadata
export const metadata: Metadata = {
  title: 'Impact4Soil',
  // TODO: update description
  description:
    'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil. Join the effort to combat climate change today.',
  keywords: 'Impact4Soil, ORCaSa, Horizon Europe, carbon capture, climate change',
  robots: 'index, follow',
  openGraph: {
    title: 'Impact4Soil - Horizon Europe Initiative',
    // TODO: update description
    description:
      'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil. Join the effort to combat climate change today.',
    // image: 'https://example.com/orcasa-image.jpg',
  },
  viewport: {
    width: 1200,
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

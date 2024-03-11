import '@/styles/globals.css';

import { Suspense } from 'react';

import { Roboto_Slab, Roboto } from 'next/font/google';
import Script from 'next/script';

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

const NEXT_PUBLIC_MATOMO_URL = process.env.NEXT_PUBLIC_MATOMO_URL;
const NEXT_PUBLIC_MATOMO_SITE_ID = process.env.NEXT_PUBLIC_MATOMO_SITE_ID;

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
        {NEXT_PUBLIC_MATOMO_URL && NEXT_PUBLIC_MATOMO_SITE_ID && (
          <Script
            id="matomo-analytics"
            dangerouslySetInnerHTML={{
              __html: `<!-- Matomo -->
            <script>
              var _paq = window._paq = window._paq || [];
              /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
              _paq.push(['trackPageView']);
              _paq.push(['enableLinkTracking']);
              (function() {
                var u="${NEXT_PUBLIC_MATOMO_URL}";
                _paq.push(['setTrackerUrl', u+'matomo.php']);
                _paq.push(['setSiteId', ${NEXT_PUBLIC_MATOMO_SITE_ID}]);
                var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
              })();
            </script>
            <!-- End Matomo Code -->`,
            }}
          />
        )}
      </html>
    </Providers>
  );
}

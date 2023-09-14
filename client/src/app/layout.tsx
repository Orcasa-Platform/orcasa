import '@/styles/globals.css';

import { Roboto_Slab, Roboto } from 'next/font/google';

import { cn } from '@/lib/classnames';

import Providers from '@/app/layout-providers';

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={cn(roboto.variable, robotoSlab.variable, 'font-sans text-default')}>
          {children}
        </body>
      </html>
    </Providers>
  );
}

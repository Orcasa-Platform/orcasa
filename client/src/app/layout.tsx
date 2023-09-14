import '@/styles/globals.css';

import { Roboto_Slab, Roboto } from 'next/font/google';

import { cn } from '@/lib/classnames';

import Providers from '@/app/layout-providers';

const robotoSlab = Roboto_Slab({ subsets: ['latin'], weight: ['400', '600', '700'] });
const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={cn(robotoSlab.className, roboto.className, 'text-default')}>
          {children}
        </body>
      </html>
    </Providers>
  );
}

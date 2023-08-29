import '@/styles/globals.css';

import { Inter } from 'next/font/google';

import Providers from '@/app/layout-providers';

const inter = Inter({ subsets: ['latin'] });

// TODO: Update metadata
export const metadata = {
  title: 'ORCaSa',
  description:
    'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil. Join the effort to combat climate change today.',
  keywords: 'ORCaSa, Horizon Europe, carbon capture, climate change',
  robots: 'index, follow',
  og: {
    title: 'ORCaSa - Horizon Europe Initiative',
    description:
      'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil. Join the effort to combat climate change today.',
    // image: 'https://example.com/orcasa-image.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </Providers>
  );
}

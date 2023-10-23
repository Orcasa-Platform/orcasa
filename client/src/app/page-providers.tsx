'use client';

import { PropsWithChildren } from 'react';

import { Provider as JotaiProvider } from 'jotai';
import { MapProvider } from 'react-map-gl/maplibre';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <JotaiProvider>
      <MapProvider>{children}</MapProvider>
    </JotaiProvider>
  );
}

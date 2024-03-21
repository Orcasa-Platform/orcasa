'use client';

import { PropsWithChildren } from 'react';

import { MapProvider } from 'react-map-gl';

import { Provider as JotaiProvider } from 'jotai';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <JotaiProvider>
      <MapProvider>{children}</MapProvider>
    </JotaiProvider>
  );
}

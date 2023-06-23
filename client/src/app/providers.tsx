'use client';

import { PropsWithChildren } from 'react';

import { MapProvider } from 'react-map-gl';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: PropsWithChildren) {
  return (
    <TooltipProvider>
      <MapProvider>{children}</MapProvider>
    </TooltipProvider>
  );
}

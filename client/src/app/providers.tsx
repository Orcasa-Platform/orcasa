'use client';

import { PropsWithChildren, useCallback, useState } from 'react';

import { MapProvider } from 'react-map-gl';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';

import { RecoilURLSyncNext } from '@/lib/recoil';
import type { Deserialize, Serialize } from '@/lib/recoil';
import RecoilDevTools from '@/lib/recoil/devtools';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient());

  const serialize: Serialize = useCallback((x) => {
    return x === undefined ? '' : JSON.stringify(x);
  }, []);

  //Demo of custom deserialization
  const deserialize: Deserialize = useCallback((x: string) => {
    return JSON.parse(x);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <RecoilURLSyncNext
          location={{ part: 'queryParams' }}
          serialize={serialize}
          deserialize={deserialize}
        >
          <RecoilDevTools />

          <TooltipProvider>
            <MapProvider>{children}</MapProvider>
          </TooltipProvider>
        </RecoilURLSyncNext>
      </RecoilRoot>
    </QueryClientProvider>
  );
}

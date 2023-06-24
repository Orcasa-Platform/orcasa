'use client';

import { PropsWithChildren, useCallback } from 'react';

import { MapProvider } from 'react-map-gl';

import { RecoilRoot } from 'recoil';

import { Deserialize, RecoilURLSyncNext, Serialize } from '@/lib/recoil';
import RecoilDevTools from '@/lib/recoil/devtools';

import { TooltipProvider } from '@/components/ui/tooltip';

export default function Providers({ children }: PropsWithChildren) {
  const serialize: Serialize = useCallback((x) => {
    return x === undefined ? '' : JSON.stringify(x);
  }, []);

  //Demo of custom deserialization
  const deserialize: Deserialize = useCallback((x: string) => {
    return JSON.parse(x);
  }, []);

  return (
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
  );
}

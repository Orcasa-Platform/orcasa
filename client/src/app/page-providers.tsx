'use client';

import { PropsWithChildren, useCallback } from 'react';

import { MapProvider } from 'react-map-gl';

import { RecoilURLSyncNext } from '@/lib/recoil';
import type { Deserialize, Serialize } from '@/lib/recoil';
import RecoilDevTools from '@/lib/recoil/devtools';

export default function Providers({ children }: PropsWithChildren) {
  const serialize: Serialize = useCallback((x) => {
    return x === undefined ? '' : JSON.stringify(x);
  }, []);

  //Demo of custom deserialization
  const deserialize: Deserialize = useCallback((x: string) => {
    return JSON.parse(x);
  }, []);

  return (
    <RecoilURLSyncNext
      location={{ part: 'queryParams' }}
      serialize={serialize}
      deserialize={deserialize}
    >
      <RecoilDevTools />

      <MapProvider>{children}</MapProvider>
    </RecoilURLSyncNext>
  );
}

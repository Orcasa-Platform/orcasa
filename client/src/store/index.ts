'use client';

import { useEffect } from 'react';

import {
  array,
  bool,
  mixed,
  nullable,
  number,
  object,
  string,
  tuple,
  writableDict,
} from '@recoiljs/refine';
import { atom, useRecoilCallback, useRecoilValue } from 'recoil';
import { urlSyncEffect } from 'recoil-sync';

// Map settings
export const mapSettingsAtom = atom({
  key: 'map-settings',
  default: {
    basemap: 'basemap-light',
    labels: 'labels-dark',
    boundaries: false,
    roads: false,
  },
  effects: [
    urlSyncEffect({
      refine: object({
        basemap: string(),
        labels: string(),
        boundaries: bool(),
        roads: bool(),
      }),
    }),
  ],
});

// Map viewport
export const bboxAtom = atom<readonly [number, number, number, number] | null | undefined>({
  key: 'bbox',
  default: null,
  effects: [
    urlSyncEffect({
      refine: nullable(tuple(number(), number(), number(), number())),
    }),
  ],
});

export const tmpBboxAtom = atom<readonly [number, number, number, number] | null>({
  key: 'tmp-bbox',
  default: null,
});

// Sidebar and menus
export const sidebarOpenAtom = atom<boolean>({
  key: 'sidebar-open',
  default: true,
});

// Map layers
export const layersAtom = atom<readonly number[]>({
  key: 'layers',
  default: [],
  effects: [
    urlSyncEffect({
      refine: array(number()),
    }),
  ],
});

export const layersSettingsAtom = atom({
  key: 'layer-settings',
  default: {},
  effects: [
    urlSyncEffect({
      refine: writableDict(writableDict(mixed())),
    }),
  ],
});

export function useSyncLayersAndSettings() {
  const layers = useRecoilValue(layersAtom);

  const syncAtoms = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const lys = await snapshot.getPromise(layersAtom);
        const lysSettings = await snapshot.getPromise(layersSettingsAtom);

        // Reset layersettings that are not in layers
        Object.keys(lysSettings).forEach((ly) => {
          if (!lys.includes(parseInt(ly))) {
            const { [ly]: _, ...rest } = lysSettings;
            set(layersSettingsAtom, rest);
          }
        });
      },
    []
  );

  // Sync layersettings when layers change
  useEffect(() => {
    syncAtoms();
  }, [layers.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return true;
}

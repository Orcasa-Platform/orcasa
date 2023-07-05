'use client';

import { useEffect } from 'react';

import { MapLayerMouseEvent } from 'react-map-gl';

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
import { atom, useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
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
  key: 'layers-settings',
  default: {},
  effects: [
    urlSyncEffect({
      refine: writableDict(writableDict(mixed())),
    }),
  ],
});

export const layersInteractiveAtom = atom<number[]>({
  key: 'layers-interactive',
  default: [],
});

export const layersInteractiveIdsAtom = atom<string[]>({
  key: 'layers-interactive-ids',
  default: [],
});

export const popupAtom = atom<MapLayerMouseEvent | null>({
  key: 'point',
  default: null,
  dangerouslyAllowMutability: true,
});

export const DEFAULT_SETTINGS = {
  expand: true,
};

export function useSyncLayersAndSettings() {
  const layers = useRecoilValue(layersAtom);

  const setPopup = useSetRecoilState(popupAtom);

  const syncAtoms = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        const lys = await snapshot.getPromise(layersAtom);
        const lysSettings = await snapshot.getPromise(layersSettingsAtom);
        const lysInteractive = await snapshot.getPromise(layersInteractiveAtom);

        // Reset layersettings that are not in layers
        Object.keys(lysSettings).forEach((ly) => {
          if (!lys.includes(parseInt(ly))) {
            setTimeout(async () => {
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const { [ly]: _, ...rest } = lysSettings;
              set(layersSettingsAtom, rest);
            }, 0);
          }
        });

        // Reset interactive layers
        // If I don't use setTimeout, the url will not be updated
        // setTimeout is needed to put this function to the end of the js queue
        setTimeout(() => {
          const newLysInteractive = lysInteractive.filter((ly) => lys.includes(ly));
          set(layersInteractiveAtom, newLysInteractive);

          if (!newLysInteractive.length) {
            setPopup(null);
          }
        }, 0);
      },
    []
  );

  // Sync layersettings when layers change
  useEffect(() => {
    syncAtoms();
  }, [layers.length, syncAtoms]);

  return true;
}

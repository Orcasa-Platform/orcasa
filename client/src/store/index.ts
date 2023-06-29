import { array, bool, nullable, number, object, string, tuple } from '@recoiljs/refine';
import { atom } from 'recoil';
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

export const layersSettingsAtom = atom<Record<string, Record<string, unknown>>>({
  key: 'layer-settings',
  default: {},
  effects: [
    urlSyncEffect({
      refine: object({}),
    }),
  ],
});

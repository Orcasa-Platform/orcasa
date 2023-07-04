import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import { DEFAULT_SETTINGS, layersSettingsAtom } from '@/store';

export const useChangeLayerSettings = () => {
  const setLayersSettings = useSetRecoilState(layersSettingsAtom);

  return useCallback(
    (id: number, setting: string, value: unknown) =>
      setLayersSettings((prev) => ({
        ...prev,
        [id]: {
          ...DEFAULT_SETTINGS,
          ...prev[id],
          [setting]: value,
        },
      })),
    [setLayersSettings]
  );
};

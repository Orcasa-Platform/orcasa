'use client';

import { useRecoilValue } from 'recoil';

import { parseConfig } from '@/lib/json-converter';

import { mapSettingsAtom } from '@/store/index';

import { useGetLayers } from '@/types/generated/layer';
import { Config } from '@/types/layers';

import MapboxLayer from '@/components/map/layers/mapbox-layer';

const BasemapLayer = () => {
  const { basemap } = useRecoilValue(mapSettingsAtom);
  const { data: basemapData, isError } = useGetLayers({
    filters: {
      role: 'basemap',
      title: basemap,
    },
  });

  if (isError || basemapData?.data?.length === 0) {
    console.error('Could not load basemap:', isError);
  }

  const { id: basemapId } = basemapData?.data?.[0] || {};

  const { config: basemapConfig } = basemapData?.data?.[0].attributes || {};
  const c = parseConfig<Config>({
    config: basemapConfig,
    params_config: [],
    settings: {},
  });

  if (!c || !basemapId) return null;
  return (
    <MapboxLayer
      id={`basemap`}
      key={`basemap-${String(basemapId)}`}
      beforeId={'custom-layers'}
      config={c}
    />
  );
};

export default BasemapLayer;

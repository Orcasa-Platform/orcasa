'use client';

import { useRecoilValue } from 'recoil';

import { parseConfig } from '@/lib/json-converter';

import { mapSettingsAtom } from '@/store/index';

import { useGetLayers } from '@/types/generated/layer';
import { LayerListResponse } from '@/types/generated/strapi.schemas';
import { Config } from '@/types/layers';

import type { BASEMAPS } from '@/constants/basemaps';

import MapboxLayer from '@/components/map/layers/mapbox-layer';

import lightBasemapData from './local-basemaps/light.json';
import satelliteBasemapData from './local-basemaps/satellite.json';

const LOCAL_BASEMAPS_ENABLED = process.env.NEXT_PUBLIC_LOCAL_BASEMAPS_ENABLED;

type BasemapType = (typeof BASEMAPS)[number]['value'];

const LOCAL_BASEMAPS: { [key: BasemapType]: LayerListResponse } = {
  'basemap-light': lightBasemapData as LayerListResponse,
  'basemap-satellite': satelliteBasemapData as LayerListResponse,
};

const BasemapLayer = () => {
  const { basemap } = useRecoilValue(mapSettingsAtom);
  let basemapData: LayerListResponse | undefined = LOCAL_BASEMAPS_ENABLED
    ? LOCAL_BASEMAPS[basemap]
    : undefined;

  const { data, isError } = useGetLayers({
    filters: {
      role: 'basemap',
      title: basemap,
    },
  });
  const hasError = isError || !data?.data?.length;
  if (hasError) {
    console.error('Could not load basemap:', isError);
  }

  if (!LOCAL_BASEMAPS_ENABLED && !hasError) {
    basemapData = data;
  }
  const { id: basemapId } = basemapData?.data?.[0] || {};
  const { config: basemapConfig } = basemapData?.data?.[0]?.attributes || {};

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

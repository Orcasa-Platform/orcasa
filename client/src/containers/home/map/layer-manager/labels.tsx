'use client';

import { useRecoilValue } from 'recoil';

import { parseConfig } from '@/lib/json-converter';

import { mapSettingsAtom } from '@/store/index';

import { useGetLayers } from '@/types/generated/layer';
import { Config } from '@/types/layers';

import MapboxLayer from '@/components/map/layers/mapbox-layer';

const LabelsLayer = () => {
  const { labels } = useRecoilValue(mapSettingsAtom);
  const { data: labelsData, isError } = useGetLayers({
    filters: {
      role: 'labels',
      title: labels,
    },
  });
  if (labels === 'labels-none') return null;

  if (isError || labelsData?.data?.length === 0) {
    console.error('Could not load labels:', isError);
  }

  const { id: labelsId } = labelsData?.data?.[0] || {};

  const { config: labelsConfig } = labelsData?.data?.[0]?.attributes || {};
  const c = parseConfig<Config>({
    config: labelsConfig,
    params_config: [],
    settings: {},
  });

  if (!c || !labelsId) return null;
  return (
    <MapboxLayer id={`labels-${String(labelsId)}`} key={`labels-${String(labelsId)}`} config={c} />
  );
};

export default LabelsLayer;

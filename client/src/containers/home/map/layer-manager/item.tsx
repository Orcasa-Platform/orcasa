'use client';

import { AnyLayer, AnySourceData } from 'mapbox-gl';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

import { parseConfig } from '@/containers/home/map/layer-manager/utils';

import DeckJsonLayer from '@/components/map/layers/deck-json-layer';
import MapboxLayer from '@/components/map/layers/mapbox-layer';

interface LayerManagerItemProps extends Required<Pick<LayerResponseDataObject, 'id'>> {
  settings: Record<string, unknown>;
}

const LayerManagerItem = ({ id, settings }: LayerManagerItemProps) => {
  const { data } = useGetLayersId(id);

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes;

  if (type === 'mapbox') {
    const { config, params_config } = data.data.attributes;

    const c = parseConfig<{
      source: AnySourceData;
      styles: AnyLayer[];
    }>({
      config,
      params_config,
      settings,
    });

    return <MapboxLayer id={`${id}-layer`} config={c} />;
  }

  if (type === 'deckgl') {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig({
      // TODO: type
      config,
      params_config,
      settings,
    });

    return <DeckJsonLayer id={`${id}-layer`} config={c} />;
  }
};

export default LayerManagerItem;

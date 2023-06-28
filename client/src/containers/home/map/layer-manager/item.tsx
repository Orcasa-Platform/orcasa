'use client';

import { AnyLayer, AnySourceData } from 'mapbox-gl';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

import { parseConfig } from '@/containers/home/map/layer-manager/utils';

import DeckJsonLayer from '@/components/map/layers/deck-json-layer';
import MapboxLayer from '@/components/map/layers/mapbox-layer';

const LayerManagerItem = ({ id }: Required<Pick<LayerResponseDataObject, 'id'>>) => {
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
      // settings
    });

    return (
      <MapboxLayer
        id={`${id}-layer`}
        config={c}
        settings={{
          opacity: 1,
          visibility: true,
        }}
      />
    );
  }

  if (type === 'deckgl') {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig({
      // TODO: type
      config,
      params_config,
      // settings
    });

    return (
      <DeckJsonLayer
        id={`${id}-layer`}
        config={c}
        settings={{
          opacity: 1,
          visibility: true,
        }}
      />
    );
  }
};

export default LayerManagerItem;

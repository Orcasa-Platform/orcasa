'use client';

import { replace } from '@/lib/utils';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

import DeckJsonLayer, { DeckJsonLayerProps } from '@/components/map/layers/deck-json-layer';
import MapboxLayer, { MapboxLayerProps } from '@/components/map/layers/mapbox-layer';

const LayerManagerItem = ({ id }: Required<Pick<LayerResponseDataObject, 'id'>>) => {
  const { data } = useGetLayersId(id);

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes;

  if (type === 'mapbox') {
    const { config } = data.data.attributes;
    const c = replace(config, {
      opacity: 1,
      color: [
        'match',
        ['get', 'bws_cat'],
        0,
        '#FF0000',
        1,
        '#d95000',
        2,
        '#ad5d00',
        3,
        '#785600',
        4,
        '#F15300',
        '#ccc',
      ],
    }) as MapboxLayerProps<Record<string, unknown>>['config'];

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
    const { config } = data.data.attributes;
    const c = config as DeckJsonLayerProps<unknown, Record<string, unknown>>['config'];

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

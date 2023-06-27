'use client';

import { useEffect } from 'react';

import { Layer } from 'react-map-gl';

import { JSONConverter } from '@deck.gl/json/typed';

import { LayerProps, Settings } from '@/types/map';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';

const JSON_CONFIGURATION = {
  layers: Object.assign(
    //
    {},
    require('@deck.gl/layers'),
    require('@deck.gl/aggregation-layers')
  ),
};

const JSON_CONVERTER = new JSONConverter({ configuration: JSON_CONFIGURATION });

export type DeckJsonLayerProps<T, S> = LayerProps<S> &
  Partial<T> & {
    layer: any;
  };

const DeckJsonLayer = <T extends unknown>({
  id,
  beforeId,
  layer,
}: DeckJsonLayerProps<T, Settings>) => {
  // Render deck layer
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();

  useEffect(() => {
    const ly = JSON_CONVERTER.convert(layer);
    addLayer(ly.clone({ id: i, beforeId }));
  }, [i, beforeId, layer, addLayer]);

  useEffect(() => {
    return () => {
      removeLayer(i);
    };
  }, [i, removeLayer]);

  return (
    <Layer
      id={id}
      type="background"
      paint={{
        'background-color': '#77CCFF',
        'background-opacity': 0,
      }}
      beforeId={beforeId}
    />
  );
};

export default DeckJsonLayer;

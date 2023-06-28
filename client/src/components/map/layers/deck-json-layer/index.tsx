/* eslint-disable @typescript-eslint/no-var-requires */
'use client';

import { useEffect } from 'react';

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
    config: Record<string, unknown>;
  };

const DeckJsonLayer = <T,>({ id, config }: DeckJsonLayerProps<T, Settings>) => {
  // Render deck layer
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();

  useEffect(() => {
    const ly = JSON_CONVERTER.convert(config);
    addLayer(ly.clone({ id: i, beforeId: id }));
  }, [i, id, config, addLayer]);

  useEffect(() => {
    return () => {
      removeLayer(i);
    };
  }, [i, removeLayer]);

  return null;
};

export default DeckJsonLayer;

'use client';

import { useEffect } from 'react';

import { Layer } from 'react-map-gl';

import { Layer as DeckglLayer } from '@deck.gl/core/typed';

import { LayerProps, Settings } from '@/types/map';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';

export type DeckLayerProps<T, S> = LayerProps<S> &
  T & {
    type: typeof DeckglLayer;
  };

const DeckLayer = <T extends unknown>({
  id,
  settings,
  beforeId,
  ...props
}: DeckLayerProps<T, Settings>) => {
  // Render deck layer
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();

  useEffect(() => {
    addLayer({ ...props, id: i, beforeId });
  }, [i, beforeId, props, addLayer]);

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

export default DeckLayer;

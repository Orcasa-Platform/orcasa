'use client';

import { useEffect } from 'react';

import { LayerProps, Settings } from '@/types/map';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';

export type DeckLayerProps<T, S> = LayerProps<S> &
  T & {
    type: any;
  };

const DeckLayer = <T,>({ id, type, ...props }: DeckLayerProps<T, Settings>) => {
  // Render deck layer
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();

  useEffect(() => {
    const ly = new type({
      ...props,
      id: i,
      beforeId: id,
    });
    addLayer(ly);
  }, [i, id, type, props, addLayer]);

  useEffect(() => {
    return () => {
      removeLayer(i);
    };
  }, [i, removeLayer]);

  return null;
};

export default DeckLayer;

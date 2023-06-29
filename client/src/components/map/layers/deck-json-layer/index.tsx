/* eslint-disable @typescript-eslint/no-var-requires */
'use client';

import { useEffect } from 'react';

import { LayerProps } from '@/types/layers';

import { useDeckMapboxOverlayContext } from '@/components/map/provider';

export type DeckJsonLayerProps<T> = LayerProps &
  Partial<T> & {
    config: any;
  };

const DeckJsonLayer = <T,>({ id, config }: DeckJsonLayerProps<T>) => {
  // Render deck config
  const i = `${id}-deck`;
  const { addLayer, removeLayer } = useDeckMapboxOverlayContext();

  useEffect(() => {
    addLayer(config.clone({ id: i, beforeId: id }));
  }, [i, id, config, addLayer]);

  useEffect(() => {
    return () => {
      removeLayer(i);
    };
  }, [i, removeLayer]);

  return null;
};

export default DeckJsonLayer;

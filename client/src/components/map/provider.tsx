'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef } from 'react';

import { useControl } from 'react-map-gl';

import { Layer, LayersList } from '@deck.gl/core';
import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox';

interface DeckMapboxOverlayContext {
  addLayer: (layer: Layer<object>) => void;
  removeLayer: (id: string) => void;
}

const Context = createContext<DeckMapboxOverlayContext>({
  addLayer: () => {
    console.info('addLayer');
  },
  removeLayer: () => {
    console.info('removeLayer');
  },
});

function useMapboxOverlay(
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  },
) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);

  return overlay;
}

export const DeckMapboxOverlayProvider = ({ children }: PropsWithChildren) => {
  const layersRef = useRef<Array<(LayersList | Layer<object>) & { id: string }>>([]);

  const OVERLAY = useMapboxOverlay({
    interleaved: true,
  });

  const addLayer = useCallback(
    (layer: Layer<object>) => {
      const newLayers = [...layersRef.current.filter((l) => l.id !== layer.id), layer];

      layersRef.current = newLayers;
      return OVERLAY.setProps({ layers: newLayers });
    },
    [OVERLAY],
  );

  const removeLayer = useCallback(
    (id: string) => {
      const newLayers = [...layersRef.current.filter((l) => l.id !== id)];

      layersRef.current = newLayers;
      OVERLAY.setProps({ layers: newLayers });
    },
    [OVERLAY],
  );

  const context = useMemo(
    () => ({
      addLayer,
      removeLayer,
    }),
    [addLayer, removeLayer],
  );

  return (
    <Context.Provider key="deck-mapbox-provider" value={context}>
      {children}
    </Context.Provider>
  );
};

export const useDeckMapboxOverlayContext = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error('useDeckMapboxOverlayContext must be used within a DeckMapboxOverlayProvider');
  }

  return context;
};

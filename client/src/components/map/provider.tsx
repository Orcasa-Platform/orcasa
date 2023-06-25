'use client';

import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef } from 'react';

import { useControl } from 'react-map-gl';

import { MapboxOverlay, MapboxOverlayProps } from '@deck.gl/mapbox/typed';

interface DeckMapboxOverlayContext {
  addLayer: (layer: any) => void;
  removeLayer: (id: any) => void;
}

const Context = createContext<DeckMapboxOverlayContext>({
  addLayer: () => {},
  removeLayer: () => {},
});

function useMapboxOverlay(
  props: MapboxOverlayProps & {
    interleaved?: boolean;
  }
) {
  const overlay = useControl<MapboxOverlay>(() => new MapboxOverlay(props));
  overlay.setProps(props);

  return overlay;
}

export const DeckMapboxOverlayProvider = ({ children }: PropsWithChildren) => {
  const layersRef = useRef<any[]>([]);

  const OVERLAY = useMapboxOverlay({
    interleaved: true,
  });

  const addLayer = useCallback(
    (layer: any) => {
      const l1 = new layer.type({
        ...layer,
        getPolygonOffset: () => [0, -100000000 + layer.zIndex * 1000],
      });

      const newLayers = [...layersRef.current.filter((l) => l.id !== layer.id), l1];

      layersRef.current = newLayers;
      OVERLAY.setProps({ layers: newLayers });
    },
    [OVERLAY]
  );

  const removeLayer = useCallback(
    (id: string) => {
      const newLayers = [...layersRef.current.filter((l) => l.id !== id)];

      layersRef.current = newLayers;
      OVERLAY.setProps({ layers: newLayers });
    },
    [OVERLAY]
  );

  const context = useMemo(
    () => ({
      addLayer,
      removeLayer,
    }),
    [addLayer, removeLayer]
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

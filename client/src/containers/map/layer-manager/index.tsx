'use client';

import { Layer } from 'react-map-gl';

import { usePathname } from 'next/navigation';

import { useLayers, useLayersSettings } from '@/store';

import LayerManagerItem from '@/containers/map/layer-manager/item';

import NetworksMarkers from '@/components/map/layers/networks-markers';
import PracticesMarkers from '@/components/map/layers/practices-markers';
import { DeckMapboxOverlayProvider } from '@/components/map/provider';

const LayerManager = () => {
  const [layers] = useLayers();
  const [layersSettings] = useLayersSettings();
  const pathname = usePathname();
  const isNetworkPage = pathname.includes('network');
  const isPracticesPage = pathname.includes('practices');

  return (
    <DeckMapboxOverlayProvider>
      <>
        {/* This layer is here to provide a base for the other layers to be positioned */}
        {/*
          Generate all transparent backgrounds to be able to sort by layers without an error
          - https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
        */}
        {layers.map((l, i) => {
          const beforeId = i === 0 ? 'data-layers' : `${layers[i - 1]}-layer`;
          return (
            <Layer
              id={`${l}-layer`}
              key={`${l}-layer`}
              type="background"
              layout={{ visibility: 'none' }}
              beforeId={beforeId}
            />
          );
        })}

        {/*
          Loop through active layers. The id is gonna be used to fetch the current layer and know how to order the layers.
          The first item will always be at the top of the layers stack
        */}
        {layers.map((l, i) => {
          const beforeId = i === 0 ? 'data-layers' : `${layers[i - 1]}-layer`;
          return (
            <LayerManagerItem
              key={l}
              id={l}
              beforeId={beforeId}
              settings={layersSettings[l] ?? { opacity: 1, visibility: true }}
            />
          );
        })}

        {isNetworkPage && <NetworksMarkers />}
        {isPracticesPage && <PracticesMarkers />}
      </>
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;

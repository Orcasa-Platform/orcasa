'use client';

import { usePathname } from 'next/navigation';

import { Layer } from 'react-map-gl/maplibre';
import { useRecoilValue } from 'recoil';

import { layersAtom, layersSettingsAtom } from '@/store';

import LayerManagerItem from '@/containers/section/map/layer-manager/item';

import NetworksLayer from '@/components/map/layers/networks-layer';
import { DeckMapboxOverlayProvider } from '@/components/map/provider';

const LayerManager = () => {
  const layers = useRecoilValue(layersAtom);
  const layersSettings = useRecoilValue(layersSettingsAtom);
  const pathname = usePathname();
  const isNetworkPage = pathname.includes('network');

  return (
    <DeckMapboxOverlayProvider>
      <>
        {/* This layer is here to provide a base for the other layers to be positioned */}
        {/*
          Generate all transparent backgrounds to be able to sort by layers without an error
          - https://github.com/visgl/react-map-gl/issues/939#issuecomment-625290200
        */}
        {layers.map((l, i) => {
          const beforeId = i === 0 ? 'custom-layers' : `${layers[i - 1]}-layer`;
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
          const beforeId = i === 0 ? 'custom-layers' : `${layers[i - 1]}-layer`;
          return (
            <LayerManagerItem
              key={l}
              id={l}
              beforeId={beforeId}
              settings={layersSettings[l] ?? { opacity: 1, visibility: true }}
            />
          );
        })}

        {isNetworkPage && <NetworksLayer beforeId="custom-layers" />}
      </>
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;

'use client';

import { Layer } from 'react-map-gl';

import { useRecoilValue } from 'recoil';

import { layersAtom } from '@/store';

import LayerManagerItem from '@/containers/home/map/layer-manager/item';

import { DeckMapboxOverlayProvider } from '@/components/map/provider';

const LayerManager = () => {
  const layers = useRecoilValue(layersAtom);

  return (
    <DeckMapboxOverlayProvider>
      <>
        {/* Generate all transparent backgrounds to be able to sort by layers without an error */}
        {layers.map((l, i) => {
          const beforeId = i === 0 ? 'custom-layers' : `${layers[i - 1]}-layer`;

          return (
            <Layer
              type="background"
              layout={{ visibility: 'none' }}
              key={l}
              id={`${l}-layer`}
              beforeId={beforeId}
            />
          );
        })}

        {/*
          Loop through active layers. The id is gonna be used to fetch the current layer and know how to order the layers.
          The first item will always be at the top of the layers stack
        */}
        {layers.map((l) => {
          return <LayerManagerItem key={l} id={l} />;
        })}
      </>
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;

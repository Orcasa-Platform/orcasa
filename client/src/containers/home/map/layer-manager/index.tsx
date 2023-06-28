'use client';

import { useRecoilValue } from 'recoil';

import { layersAtom } from '@/store';

import LayerManagerItem from '@/containers/home/map/layer-manager/item';

import { DeckMapboxOverlayProvider } from '@/components/map/provider';

const LayerManager = () => {
  const layers = useRecoilValue(layersAtom);

  return (
    <DeckMapboxOverlayProvider>
      <>
        {layers.map((l, i) => {
          const beforeId = i === 0 ? 'custom-layers' : `${layers[i - 1]}-layer`;

          return <LayerManagerItem key={l} id={l} beforeId={beforeId} />;
        })}
      </>
    </DeckMapboxOverlayProvider>
  );
};

export default LayerManager;

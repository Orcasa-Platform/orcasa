'use client';

import { useCallback } from 'react';

import { useSetRecoilState } from 'recoil';

import { layersInteractiveAtom, layersInteractiveIdsAtom } from '@/store';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';
import { Config, MaboxLayer } from '@/types/layers';

import { parseConfig } from '@/containers/home/map/layer-manager/utils';

import DeckJsonLayer from '@/components/map/layers/deck-json-layer';
import MapboxLayer from '@/components/map/layers/mapbox-layer';

interface LayerManagerItemProps extends Required<Pick<LayerResponseDataObject, 'id'>> {
  settings: Record<string, unknown>;
}

const LayerManagerItem = ({ id, settings }: LayerManagerItemProps) => {
  const { data } = useGetLayersId(id);
  const setLayersInteractive = useSetRecoilState(layersInteractiveAtom);
  const setLayersInteractiveIds = useSetRecoilState(layersInteractiveIdsAtom);

  const handleAddMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as MaboxLayer;

      if (interaction_config?.enabled) {
        const ids = styles.map((l) => l.id);

        setLayersInteractive((prev) => [...prev, id]);
        setLayersInteractiveIds((prev) => [...prev, ...ids]);
      }
    },
    [data?.data?.attributes, id, setLayersInteractive, setLayersInteractiveIds]
  );

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes as MaboxLayer;

  if (type === 'mapbox') {
    const { config, params_config } = data.data.attributes;

    const c = parseConfig<Config>({
      config,
      params_config,
      settings,
    });

    return <MapboxLayer id={`${id}-layer`} config={c} onAdd={handleAddMapboxLayer} />;
  }

  if (type === 'deckgl') {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig({
      // TODO: type
      config,
      params_config,
      settings,
    });

    return <DeckJsonLayer id={`${id}-layer`} config={c} />;
  }
};

export default LayerManagerItem;

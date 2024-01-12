'use client';

import { useCallback } from 'react';

import { Layer } from '@deck.gl/core/typed';

import { parseConfig } from '@/lib/json-converter';

import { useLayersInteractive, useLayersInteractiveIds } from '@/store';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';
import { Config, LayerTyped } from '@/types/layers';

import BoundsLayer from '@/components/map/layers/bounds-layer';
import DeckGLLayer from '@/components/map/layers/deckgl-layer';
import MapboxLayer from '@/components/map/layers/mapbox-layer';

interface LayerManagerItemProps extends Required<Pick<LayerResponseDataObject, 'id'>> {
  beforeId: string;
  settings: Record<string, unknown>;
}

const LayerManagerItem = ({ id, beforeId, settings }: LayerManagerItemProps) => {
  const { data } = useGetLayersId(id, {
    populate: 'metadata',
  });
  const [layersInteractive, setLayersInteractive] = useLayersInteractive();
  const [, setLayersInteractiveIds] = useLayersInteractiveIds();

  const handleAddMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled) {
        const ids = styles.map((l) => l.id);

        if (layersInteractive.includes(id)) {
          return;
        }

        setLayersInteractive((prev) => [...prev, id]);
        setLayersInteractiveIds((prev) => [...prev, ...ids.map((id) => +id)]);
      }
    },
    [data?.data?.attributes, id, layersInteractive, setLayersInteractive, setLayersInteractiveIds],
  );

  const handleRemoveMapboxLayer = useCallback(
    ({ styles }: Config) => {
      if (!data?.data?.attributes) return null;

      const { interaction_config } = data.data.attributes as LayerTyped;

      if (interaction_config?.enabled) {
        const ids = styles.map((l) => l.id);

        setLayersInteractive((prev) => prev.filter((i) => i !== id));
        setLayersInteractiveIds((prev) => prev.filter((i) => !ids.includes(i.toString())));
      }
    },
    [data?.data?.attributes, id, setLayersInteractive, setLayersInteractiveIds],
  );

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes as LayerTyped;

  if (type === 'mapbox') {
    const { config, params_config, highlighted_bounds } = data.data.attributes;

    const c = parseConfig<Config>({
      config,
      params_config,
      settings,
    });

    const bounds = highlighted_bounds as number[][] | null;

    if (!c) return null;
    // We need to add a key when we replace the tiles only for raster layers as it will fail on source change
    const keyProp = c.source.type === 'raster' ? { key: c.source.tiles?.toString() } : {};
    return (
      <>
        <MapboxLayer
          {...keyProp}
          id={`${id}-layer`}
          beforeId={beforeId}
          config={c}
          onAdd={handleAddMapboxLayer}
          onRemove={handleRemoveMapboxLayer}
        />
        {bounds && bounds.length > 0 && (
          <BoundsLayer id={`${id}-bounds-layer`} config={c} bounds={bounds} beforeId={beforeId} />
        )}
      </>
    );
  }

  if (type === 'deckgl') {
    const { config, params_config } = data.data.attributes;
    const c = parseConfig({
      // TODO: type
      config,
      params_config,
      settings,
    }) as Layer<{ beforeId: string }>;

    return <DeckGLLayer id={`${id}-layer`} beforeId={beforeId} config={c} />;
  }
};

export default LayerManagerItem;

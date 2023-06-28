import { useEffect } from 'react';

import { Source, Layer } from 'react-map-gl';

import { AnyLayer, AnySourceData } from 'mapbox-gl';

import { LayerProps, Settings } from '@/types/map';

export type MapboxLayerProps<S> = LayerProps<S> & {
  config: {
    source: AnySourceData;
    styles: AnyLayer[];
  };
  params_config?: Record<string, unknown>[];
};

const MapboxLayer = ({ id, config, onAdd, onRemove }: MapboxLayerProps<Settings>) => {
  const SOURCE = config.source;
  const STYLES = config.styles;

  useEffect(() => {
    if (SOURCE && STYLES && onAdd) {
      onAdd({
        source: SOURCE,
        layers: STYLES,
      });
    }

    return () => {
      if (SOURCE && STYLES && onRemove) {
        onRemove({
          source: SOURCE,
          layers: STYLES,
        });
      }
    };
  }, [onAdd, onRemove]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!SOURCE || !STYLES) return null;

  return (
    <Source {...SOURCE}>
      {STYLES.map((layer: AnyLayer) => (
        <Layer key={layer.id} {...layer} beforeId={id} />
      ))}
      {!STYLES.length && SOURCE.type === 'raster' && <Layer type="raster" beforeId={id} />}
    </Source>
  );
};

export default MapboxLayer;

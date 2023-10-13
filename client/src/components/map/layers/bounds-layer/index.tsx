import { useMemo } from 'react';

import { Source, Layer, GeoJSONSourceRaw, LineLayer } from 'react-map-gl/maplibre';

import { Config, LayerProps } from '@/types/layers';

export type BoundsLayerProps = LayerProps & {
  bounds: number[][];
  config: Config;
  beforeId?: string;
};

const getSource = (bounds: number[][]): GeoJSONSourceRaw | null => {
  // Using a try/catch in case the data is invalid in Strapi
  try {
    return {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [bounds[0][0], bounds[1][1]],
              [bounds[0][0], bounds[0][1]],
              [bounds[1][0], bounds[0][1]],
              [bounds[1][0], bounds[1][1]],
              [bounds[0][0], bounds[1][1]],
            ],
          ],
        },
        properties: {},
      },
    };
  } catch (e) {
    console.error('Invalid bounds');
    return null;
  }
};

const getLayer = (config: Config): Omit<LineLayer, 'source'> => ({
  id: 'bounds-layer',
  type: 'line',
  layout: {
    // We apply the visibility but not the opacity property to this layer
    visibility: 'layout' in config.styles[0] ? config.styles[0].layout?.visibility : 'visible',
  },
  paint: {
    'line-color': '#ccc',
    'line-width': 2,
    'line-dasharray': [2, 2],
  },
});

const BoundsLayer = ({ id, bounds, config, beforeId }: BoundsLayerProps) => {
  const source = useMemo(() => getSource(bounds), [bounds]);
  const layer = useMemo(() => getLayer(config), [config]);

  if (!source) {
    return null;
  }

  return (
    <Source id={id} {...source}>
      <Layer {...layer} beforeId={beforeId} />
    </Source>
  );
};

export default BoundsLayer;

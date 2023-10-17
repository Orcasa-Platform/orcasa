import { useMemo } from 'react';

import { Source, Layer, CircleLayer } from 'react-map-gl/maplibre';

import { LayerProps } from '@/types/layers';

import { useMapNetworks } from '@/hooks/networks';

export type NetworksLayerProps = LayerProps & {
  beforeId?: string;
};

const getLayer = (): Omit<CircleLayer, 'source'> => ({
  id: 'networks-layer',
  type: 'circle',
  layout: {
    visibility: 'visible',
  },
  paint: {
    'circle-radius': 5,
    'circle-color': '#000',
  },
});

const NetworksLayer = ({ id, beforeId }: NetworksLayerProps) => {
  const { data: source, isError, isFetched } = useMapNetworks();
  const layer = useMemo(() => getLayer(), []);
  if (!source || (isFetched && isError)) {
    return null;
  }
  return (
    <Source id={id} {...source}>
      <Layer {...layer} beforeId={beforeId} />
    </Source>
  );
};

export default NetworksLayer;

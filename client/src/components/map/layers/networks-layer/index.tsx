import { useMemo } from 'react';

import { Source, Layer, SymbolLayer } from 'react-map-gl/maplibre';

import { LayerProps } from '@/types/layers';

import { useMapNetworks } from '@/hooks/networks';

export type NetworksLayerProps = LayerProps & {
  beforeId?: string;
};

const getOrganizationsLayer = (): Omit<SymbolLayer, 'source'> => ({
  id: 'organizations-networks-layer',
  type: 'symbol',
  layout: {
    // SHARED
    'icon-image': 'square',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'text-size': 16,
    'text-anchor': 'top',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    // ORGANIZATIONS
    'text-offset': [0.75, -0.5],
    'icon-offset': [10, 0],
    'icon-size': [
      'interpolate',
      ['linear'],
      ['length', ['get', 'organizations']],
      0,
      0,
      1,
      1,
      10,
      2,
    ],
    'text-field': ['number-format', ['length', ['get', 'organizations']], { locale: 'en' }],
  },
  paint: {
    'text-color': '#fff',
    'icon-color': '#2487E3',
  },
});
const getProjectsLayer = (): Omit<SymbolLayer, 'source'> => ({
  id: 'projects-networks-layer',
  type: 'symbol',
  layout: {
    // SHARED
    'icon-image': 'square',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true,
    'text-size': 16,
    'text-anchor': 'top',
    'text-allow-overlap': true,
    'text-ignore-placement': true,
    // PROJECTS
    'icon-size': ['interpolate', ['linear'], ['length', ['get', 'projects']], 0, 0, 1, 1, 10, 2],
    'icon-offset': [-10, 0],
    'text-field': ['number-format', ['length', ['get', 'projects']], { locale: 'en' }],
    'text-offset': [-0.75, -0.5],
  },
  paint: {
    'text-color': '#fff',
    'icon-color': '#EF6A4C',
  },
});

const NetworksLayer = ({ id, beforeId }: NetworksLayerProps) => {
  const { data: source, isError, isFetched } = useMapNetworks();
  const organizationsLayer = useMemo(() => getOrganizationsLayer(), []);
  const projectsLayer = useMemo(() => getProjectsLayer(), []);
  if (!source || (isFetched && isError)) {
    return null;
  }
  return (
    <Source id={id} {...source}>
      <Layer {...organizationsLayer} beforeId={beforeId} />
      <Layer {...projectsLayer} beforeId="organizations-networks-layer" />
    </Source>
  );
};

export default NetworksLayer;

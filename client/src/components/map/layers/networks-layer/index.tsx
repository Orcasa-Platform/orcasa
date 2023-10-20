import { useMemo } from 'react';

import { GeoJSONSourceSpecification } from 'maplibre-gl';
import { Source, Layer, SymbolLayer } from 'react-map-gl/maplibre';

import { LayerProps } from '@/types/layers';

import { useMapNetworks } from '@/hooks/networks';

export type NetworksLayerProps = LayerProps & {
  beforeId?: string;
};

const getClusterSource = (source: GeoJSONSourceSpecification): GeoJSONSourceSpecification => ({
  type: 'geojson',
  data: source.data,
  cluster: true,
  clusterMaxZoom: 14, // Max zoom to cluster points on
  clusterRadius: 100, // Radius of each cluster when clustering points
  clusterProperties: {
    organizationsCount: ['+', ['get', 'organizationsCount']],
    projectsCount: ['+', ['get', 'projectsCount']],
  },
});

const sharedLayout: SymbolLayer['layout'] = {
  'icon-image': 'rect',
  'icon-allow-overlap': true,
  'icon-ignore-placement': true,
  'text-size': 12,
  'text-anchor': 'top',
  'text-allow-overlap': true,
  'text-ignore-placement': true,
};

const organizationsStyle: { layout: SymbolLayer['layout']; paint: SymbolLayer['paint'] } = {
  layout: {
    ...sharedLayout,
    'icon-size': ['interpolate', ['linear'], ['get', 'organizationsCount'], 0, 0, 1, 1, 10, 2],
    'icon-offset': [10, 0],
    'text-field': ['number-format', ['get', 'organizationsCount'], { locale: 'en' }],
    'text-anchor': 'left',
    'text-offset': [0.75, 0],
  },
  paint: {
    'text-color': '#fff',
    'icon-color': '#2487E3',
    'icon-translate-anchor': 'map',
  },
};

const projectsStyle: { layout: SymbolLayer['layout']; paint: SymbolLayer['paint'] } = {
  layout: {
    ...sharedLayout,
    'icon-size': ['interpolate', ['linear'], ['get', 'projectsCount'], 0, 0, 1, 1, 10, 2],
    'icon-offset': [-10, 0],
    'text-anchor': 'right',
    'text-field': ['number-format', ['get', 'projectsCount'], { locale: 'en' }],
    'text-offset': [-0.75, 0],
  },
  paint: {
    'text-color': '#fff',
    'icon-color': '#EF6A4C',
  },
};

const paintBorder: SymbolLayer['paint'] = {
  'icon-halo-color': '#000',
  'icon-halo-width': 4,
  'icon-halo-blur': 0,
};
// STYLE LAYERS

const getOrganizationsLayer = (): Omit<SymbolLayer, 'source'> => ({
  id: 'organizations-networks-layer',
  type: 'symbol',
  filter: ['!', ['has', 'point_count']],
  layout: organizationsStyle.layout,
  paint: {
    ...organizationsStyle.paint,
    ...paintBorder,
  },
});

const getOrganizationsClusterLayer = (): Omit<SymbolLayer, 'source'> => ({
  id: 'organizations-cluster-networks-layer',
  type: 'symbol',
  filter: ['has', 'point_count'],
  ...organizationsStyle,
});

const getProjectsLayer = (): Omit<SymbolLayer, 'source'> => ({
  id: 'projects-networks-layer',
  type: 'symbol',
  filter: ['!', ['has', 'point_count']],
  layout: projectsStyle.layout,
  paint: {
    ...projectsStyle.paint,
    ...paintBorder,
  },
});

const getProjectsClusterLayer = (): Omit<SymbolLayer, 'source'> => ({
  id: 'projects-cluster-networks-layer',
  type: 'symbol',
  filter: ['has', 'point_count'],
  ...projectsStyle,
});

const NetworksLayer = ({ id, beforeId }: NetworksLayerProps) => {
  const { data: source, isError, isFetched } = useMapNetworks();
  const clusterSource = useMemo(() => getClusterSource(source), [source]);
  const organizationsLayer = useMemo(() => getOrganizationsLayer(), []);
  const organizationsClusterLayer = useMemo(() => getOrganizationsClusterLayer(), []);
  const projectsClusterLayer = useMemo(() => getProjectsClusterLayer(), []);
  const projectsLayer = useMemo(() => getProjectsLayer(), []);
  if (!source || (isFetched && isError)) {
    return null;
  }
  return (
    <>
      <Source id={id} {...clusterSource}>
        <Layer {...organizationsLayer} beforeId={beforeId} />
        <Layer {...organizationsClusterLayer} beforeId="organizations-networks-layer" />
        <Layer {...projectsLayer} beforeId="organizations-cluster-networks-layer" />
        <Layer {...projectsClusterLayer} beforeId="projects-networks-layer" />
      </Source>
    </>
  );
};

export default NetworksLayer;

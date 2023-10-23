import { useMemo } from 'react';

import { Marker, useMap } from 'react-map-gl/maplibre';
import Supercluster from 'supercluster';

import { cn } from '@/lib/classnames';

import { LayerProps } from '@/types/layers';

import { OrganizationProperties, ProjectProperties, useMapNetworks } from '@/hooks/networks';

export type NetworksLayerProps = LayerProps & {
  beforeId?: string;
};

const sizes = {
  '1-10': 'h-[40px] w-[20px]',
  '10-50': 'h-[60px] w-[40px]',
  '50-100': 'h-[80px] w-[60px]',
  '>100': 'h-[100px] w-[80px]',
};

const getSize = (size: number) => {
  if (size < 10) {
    return sizes['1-10'];
  }
  if (size < 50) {
    return sizes['10-50'];
  }
  if (size < 100) {
    return sizes['50-100'];
  }
  return sizes['>100'];
};

type MarkerProps = {
  iso: string | number;
  longitude: number;
  latitude: number;
  organizations: OrganizationProperties[];
  projects: ProjectProperties[];
  isCluster?: boolean;
  onClick?: () => void;
};

const MarkerComponent = ({
  iso,
  longitude,
  latitude,
  organizations,
  projects,
  isCluster = false,
  onClick,
}: MarkerProps) => (
  <Marker key={`marker-${iso}`} longitude={longitude} latitude={latitude} onClick={onClick}>
    <div className="flex items-center gap-px">
      {organizations.length > 0 && (
        <div
          className={cn(
            'flex origin-left items-center justify-center bg-blue-500',
            getSize(organizations?.length),
            { 'border-2 border-black': !isCluster },
          )}
        >
          <div className="text-sm text-white">{organizations?.length}</div>
        </div>
      )}
      {projects.length > 0 && (
        <div
          className={cn(
            'flex origin-left items-center justify-center bg-peach-700',
            getSize(projects?.length),
            { 'border-2 border-black': !isCluster },
          )}
        >
          <div className="text-sm text-white">{projects?.length}</div>
        </div>
      )}
    </div>
  </Marker>
);

const NetworksMarkers = () => {
  const { current: map } = useMap();
  const { features, isError, isFetched } = useMapNetworks();

  const SUPERCLUSTER: Supercluster = useMemo(
    () => features && new Supercluster({ radius: 100 }).load(features),
    [features],
  );

  const bbox = map?.getBounds().toArray().flat() as [number, number, number, number];
  const zoom = map?.getZoom();

  const clusters = useMemo(() => {
    if (!SUPERCLUSTER || typeof zoom === 'undefined') return [];

    return SUPERCLUSTER.getClusters(bbox, zoom);
  }, [SUPERCLUSTER, bbox, zoom]);

  if (!features || (isFetched && isError) || typeof map === 'undefined') {
    return null;
  }

  // Convert data to GeoJSON feature array

  // The features on clusters can be a cluster or a point.
  // If is a cluster (properties.cluster = true):
  return (
    <>
      {clusters.map((feature) => {
        const { geometry, properties } = feature;
        const { coordinates } = geometry;
        const [longitude, latitude] = coordinates;

        const clusterFeaturesProps = properties as Supercluster.ClusterProperties;

        if (clusterFeaturesProps.cluster) {
          const { cluster_id: clusterId } = clusterFeaturesProps;
          const leaves = SUPERCLUSTER.getLeaves(clusterId, Infinity);
          const organizations = leaves.reduce<OrganizationProperties[]>(
            (acc, leaf) => [...acc, ...leaf.properties.organizations],
            [],
          );
          const projects = leaves.reduce<ProjectProperties[]>(
            (acc, leaf) => [...acc, ...leaf.properties.projects],
            [],
          );
          return (
            <MarkerComponent
              onClick={() => {
                const targetZoom = SUPERCLUSTER.getClusterExpansionZoom(clusterId);
                map?.flyTo({
                  center: [longitude, latitude],
                  zoom: targetZoom,
                });
              }}
              key={`cluster-marker-${clusterId}`}
              iso={clusterId}
              longitude={longitude}
              latitude={latitude}
              organizations={organizations}
              projects={projects}
              isCluster
            />
          );
        }

        // If is not a cluster, it's a country marker
        return (
          <MarkerComponent
            key={`marker-${properties.countryKey}`}
            iso={properties.countryKey}
            longitude={longitude}
            latitude={latitude}
            organizations={properties.organizations}
            projects={properties.projects}
          />
        );
      })}
    </>
  );
};

export default NetworksMarkers;

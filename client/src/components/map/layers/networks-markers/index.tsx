import { useState, useMemo, useEffect, useCallback } from 'react';

import { Marker, useMap } from 'react-map-gl/maplibre';
import Supercluster from 'supercluster';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { LayerProps } from '@/types/layers';

import { useFilters } from '@/app/(modules)/network/store';

import { OrganizationProperties, ProjectProperties, useMapNetworks } from '@/hooks/networks';

import NetworksPopup, { PopupAttributes } from '@/components/map/networks-popup';

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
  id: string | number;
  longitude: number;
  latitude: number;
  organizations: OrganizationProperties[];
  projects: ProjectProperties[];
  isCluster?: boolean;
  onClick?: (type: 'project' | 'organization') => void;
};

const MarkerComponent = ({
  id,
  longitude,
  latitude,
  organizations,
  projects,
  isCluster = false,
  onClick,
}: MarkerProps) => (
  <Marker key={`marker-${id}`} longitude={longitude} latitude={latitude}>
    <div className="flex items-center gap-px">
      {organizations.length > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick('organization');
          }}
          className={cn(
            'flex origin-left items-center justify-center bg-blue-500',
            getSize(organizations?.length),
            { 'border-2 border-gray-800': !isCluster },
          )}
        >
          <div className="text-sm text-white">
            {format({ id: 'formatNumber', value: organizations.length })}
          </div>
        </button>
      )}
      {projects.length > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick('project');
          }}
          className={cn(
            'flex origin-left items-center justify-center bg-peach-700',
            getSize(projects?.length),
            { 'border-2 border-gray-800': !isCluster },
          )}
        >
          <div className="text-sm text-white">
            {format({ id: 'formatNumber', value: projects.length })}
          </div>
        </button>
      )}
    </div>
  </Marker>
);

const NetworksMarkers = () => {
  const { current: map } = useMap();
  const [filters] = useFilters();
  const { features, isError, isFetched } = useMapNetworks({ filters });
  const [popup, setPopup] = useState<PopupAttributes>(null);

  // Close popup on map click. Important stopPropagation() in MarkerComponent
  const onClickMap = useCallback(() => setPopup(null), [setPopup]);
  useEffect(() => {
    if (map) {
      map.on('click', onClickMap);

      return () => {
        map.off('click', onClickMap);
      };
    }
  }, [map, onClickMap]);

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
      <NetworksPopup popup={popup} setPopup={setPopup} />
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
              id={clusterId}
              longitude={longitude}
              latitude={latitude}
              organizations={organizations}
              projects={projects}
              isCluster
            />
          );
        }

        // If is not a cluster, it's a country marker
        const { countryName, organizations, projects } = properties;
        return (
          <MarkerComponent
            key={`marker-${countryName}`}
            id={countryName}
            longitude={longitude}
            latitude={latitude}
            organizations={organizations}
            projects={projects}
            onClick={(type) => {
              setPopup({
                type,
                longitude,
                latitude,
                properties: {
                  countryName,
                  organizations,
                  projects,
                },
              });
            }}
          />
        );
      })}
    </>
  );
};

export default NetworksMarkers;

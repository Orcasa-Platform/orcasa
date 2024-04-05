import { useState, useMemo, useEffect, useCallback } from 'react';

import { Marker, useMap } from 'react-map-gl';

import { usePathname } from 'next/navigation';

import Supercluster from 'supercluster';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { useNetworkFilters } from '@/store/network';

import { useGetOrganizationsId } from '@/types/generated/organization';
import { useGetProjectsId } from '@/types/generated/project';
import { LayerProps } from '@/types/layers';

import { useMapNetworks, useMapNetworksRelations } from '@/hooks/networks';
import type {
  OrganizationProperties,
  ProjectProperties,
  PointFeatureWithNetworkProperties,
  NetworkProperties,
} from '@/hooks/networks';

import NetworksPopup, { PopupAttributes } from '@/components/map/networks-popup';

export type NetworksLayerProps = LayerProps & {
  beforeId?: string;
};

const sizes = {
  '1-10': 'h-6 w-6',
  '10-100': 'h-10 w-10',
  '100-1k': 'h-[60px] w-[60px]',
  '>1k': 'h-20 w-20',
};

const getSize = (size: number) => {
  if (size < 10) {
    return sizes['1-10'];
  }
  if (size < 100) {
    return sizes['10-100'];
  }
  if (size < 1000) {
    return sizes['100-1k'];
  }
  return sizes['>1k'];
};

type MarkerProps = {
  id: string | number;
  longitude: number;
  latitude: number;
  organizations: OrganizationProperties[];
  projects: ProjectProperties[];
  highlight?: 'project' | 'organization';
  onClick?: (type: 'project' | 'organization') => void;
};

const MarkerComponent = ({
  id,
  longitude,
  latitude,
  organizations,
  projects,
  highlight,
  onClick,
}: MarkerProps) => (
  <Marker key={`marker-${id}`} longitude={longitude} latitude={latitude}>
    <div className="flex items-center gap-1">
      {organizations.length > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick('organization');
          }}
          className={cn(
            'flex origin-left items-center justify-center rounded-full bg-green-700',
            getSize(organizations?.length),
            {
              'relative after:absolute after:-z-10 after:block after:h-full after:w-full after:animate-pulse-ping after:rounded-full after:bg-green-700 after:content-[""]':
                highlight === 'organization',
            },
          )}
        >
          <div className="font-sans text-sm text-white">
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
            'flex origin-left items-center justify-center rounded-full bg-purple-500',
            getSize(projects?.length),
            {
              'relative after:absolute after:-z-10 after:block after:h-full after:w-full after:animate-pulse-ping after:rounded-full after:bg-purple-500 after:content-[""]':
                highlight === 'project',
            },
          )}
        >
          <div className="font-sans text-sm text-white">
            {format({ id: 'formatNumber', value: projects.length })}
          </div>
        </button>
      )}
    </div>
  </Marker>
);

const NetworkMarkersWithData = ({
  features,
  isFetched,
  isError,
  type,
  id,
}: {
  features: PointFeatureWithNetworkProperties[];
  isFetched: boolean;
  isError: boolean;
  type?: 'organization' | 'project';
  id?: number;
}) => {
  const { current: map } = useMap();
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

  const SUPERCLUSTER = useMemo(
    () => features && new Supercluster<NetworkProperties>({ radius: 90 }).load(features),
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

  const { data: parentNetworkData } = (
    type === 'organization' ? useGetOrganizationsId : useGetProjectsId
  )(
    // We're falling back to 0 just to please the type checker. The query is not run if `id` is
    // `undefined` (see `enabled` below).
    id ?? 0,
    undefined,
    {
      query: {
        enabled: typeof id !== 'undefined',
      },
    },
  );

  const parentNetworkName = parentNetworkData?.data?.attributes?.name;

  return (
    <>
      <NetworksPopup
        popup={popup}
        setPopup={setPopup}
        parentName={parentNetworkName}
        parentType={type}
      />
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

          const isOrganizationHighlighted =
            !!id &&
            type === 'organization' &&
            organizations.some((organization) => organization.id === id);

          const isProjectHighlighted =
            !!id && type === 'project' && projects.some((project) => project.id === id);

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
              highlight={
                (isOrganizationHighlighted ? 'organization' : undefined) ??
                (isProjectHighlighted ? 'project' : undefined)
              }
            />
          );
        }

        // If is not a cluster, it's a country marker
        const { countryName, organizations, projects } = properties as NetworkProperties;

        const isOrganizationHighlighted =
          !!id &&
          type === 'organization' &&
          organizations.some((organization) => organization.id === id);

        const isProjectHighlighted =
          !!id && type === 'project' && projects.some((project) => project.id === id);

        return (
          <MarkerComponent
            key={`marker-${countryName}`}
            id={countryName}
            longitude={longitude}
            latitude={latitude}
            organizations={organizations}
            projects={projects}
            highlight={
              (isOrganizationHighlighted ? 'organization' : undefined) ??
              (isProjectHighlighted ? 'project' : undefined)
            }
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

const NetworkMarkersFull = () => {
  const [filters] = useNetworkFilters();

  return <NetworkMarkersWithData {...useMapNetworks({ filters })} />;
};

const NetworkMarkerRelations = (network: Parameters<typeof useMapNetworksRelations>[0]) => (
  <NetworkMarkersWithData {...useMapNetworksRelations(network)} {...network} />
);

const NetworksMarkers = () => {
  const pathname = usePathname();
  const [, , type, id] = pathname?.split('/') || [];
  const network = {
    type: (type === 'initiative' ? 'project' : 'organization') as 'organization' | 'project',
    id: Number(id),
  };

  // We need to separate the components to avoid conditional rendering of the hooks
  return !!type ? <NetworkMarkerRelations {...network} /> : <NetworkMarkersFull />;
};
export default NetworksMarkers;

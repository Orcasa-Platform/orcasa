import { useState, useMemo, useEffect, useCallback } from 'react';

import { Marker, useMap } from 'react-map-gl';

import { usePathname } from 'next/navigation';

import Supercluster from 'supercluster';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { usePracticesFilters } from '@/store/practices';

import { LayerProps } from '@/types/layers';

import { useMapPractices, useMapPractice } from '@/hooks/practices';
import type { PracticesProperties, PointFeatureWithPracticeProperties } from '@/hooks/practices';

import PracticesPopup, { PopupAttributes } from '@/components/map/practices-popup';

export type PracticesLayerProps = LayerProps & {
  beforeId?: string;
};

const sizes = {
  '1-100': 'h-[20px] w-[20px]',
  '100-500': 'h-[40px] w-[40px]',
  '500-1k': 'h-[60px] w-[60px]',
  '>1k': 'h-[80px] w-[80px]',
};

const getSize = (size: number) => {
  if (size < 100) {
    return sizes['1-100'];
  }
  if (size < 500) {
    return sizes['100-500'];
  }
  if (size < 1000) {
    return sizes['500-1k'];
  }
  return sizes['>1k'];
};

type MarkerProps = {
  id: string | number;
  longitude: number;
  latitude: number;
  practices: PracticesProperties[];
  isCluster?: boolean;
  onClick?: (type: 'project' | 'organization') => void;
};

const MarkerComponent = ({ id, longitude, latitude, practices, onClick }: MarkerProps) => (
  <Marker key={`marker-${id}`} longitude={longitude} latitude={latitude}>
    {practices.length > 0 && (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick('organization');
        }}
        className={cn(
          'flex items-center justify-center rounded-full bg-green-700',
          getSize(practices?.length),
        )}
      >
        <div className="text-sm text-white">
          {format({ id: 'formatNumber', value: practices.length })}
        </div>
      </button>
    )}
  </Marker>
);

const PracticeMarkersWithData = ({
  features,
  isFetched,
  isError,
}: {
  features: PointFeatureWithPracticeProperties[];
  isFetched: boolean;
  isError: boolean;
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

  return (
    <>
      <PracticesPopup popup={popup} setPopup={setPopup} />
      {clusters.map((feature) => {
        const { geometry, properties } = feature;

        const { coordinates } = geometry;
        const [longitude, latitude] = coordinates;

        const clusterFeaturesProps = properties as Supercluster.ClusterProperties;

        if (clusterFeaturesProps.cluster) {
          const { cluster_id: clusterId } = clusterFeaturesProps;
          const leaves = SUPERCLUSTER.getLeaves(clusterId, Infinity);
          const practices = leaves.reduce<PracticesProperties[]>(
            (acc, leaf) => [...acc, ...leaf.properties.practices],
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
              practices={practices}
              isCluster
            />
          );
        }

        // If is not a cluster, it's a country marker
        const { countryName, practices } = properties;
        return (
          <MarkerComponent
            key={`marker-${countryName}`}
            id={countryName}
            longitude={longitude}
            latitude={latitude}
            practices={practices}
            onClick={() => {
              setPopup({
                longitude,
                latitude,
                properties: {
                  countryName,
                  practices,
                },
              });
            }}
          />
        );
      })}
    </>
  );
};

const PracticeMarkersFull = () => {
  const [filters] = usePracticesFilters();

  return <PracticeMarkersWithData {...useMapPractices({ filters })} />;
};

const PracticeMarkerRelations = (practice: Parameters<typeof useMapPractice>[0]) => (
  <PracticeMarkersWithData {...useMapPractice(practice)} {...practice} />
);

const PracticesMarkers = () => {
  const pathname = usePathname();
  const [, , id] = pathname?.split('/') || [];
  const practice = {
    id: Number(id),
  };

  // We need to separate the components to avoid conditional rendering of the hooks
  return !!id ? <PracticeMarkerRelations {...practice} /> : <PracticeMarkersFull />;
};
export default PracticesMarkers;

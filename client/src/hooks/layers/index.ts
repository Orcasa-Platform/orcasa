'use client';

import { useQueries } from '@tanstack/react-query';

import { getGetDeckGlLayersQueryOptions } from '@/types/generated/deck-gl-layer';
import { getGetMapboxLayersQueryOptions } from '@/types/generated/mapbox-layer';

interface UseLayersProps {
  datasetId: number;
}

export const useLayers = ({ datasetId }: UseLayersProps) => {
  const mapboxLayersOptions = getGetMapboxLayersQueryOptions({ filters: { dataset: datasetId } });
  const deckglLayersOptions = getGetDeckGlLayersQueryOptions({ filters: { dataset: datasetId } });
  const layerQueries = useQueries({
    queries: [
      {
        queryKey: mapboxLayersOptions.queryKey,
        queryFn: mapboxLayersOptions.queryFn,
      },
      {
        queryKey: deckglLayersOptions.queryKey,
        queryFn: deckglLayersOptions.queryFn,
      },
    ],
  });

  return layerQueries;
};

'use client';

import {
  DeckGlLayerListResponseDataItem,
  MapboxLayerListResponseDataItem,
} from '@/types/generated/strapi.schemas';

import { useLayers } from '@/hooks/layers';

import LayersItem from '@/containers/home/datasets/layers/item';

import ContentLoader from '@/components/ui/loader';

export default function LayersList({ datasetId }: { datasetId: number }) {
  const [mapboxLayersQuery, deckglLayersQuery] = useLayers({ datasetId });

  return (
    <ContentLoader
      data={!!mapboxLayersQuery?.data?.data && !!deckglLayersQuery?.data?.data}
      isFetching={mapboxLayersQuery.isFetching || deckglLayersQuery.isFetching}
      isFetched={mapboxLayersQuery.isFetched && deckglLayersQuery.isFetched}
      isPlaceholderData={mapboxLayersQuery.isPlaceholderData || deckglLayersQuery.isPlaceholderData}
      isError={mapboxLayersQuery.isError || deckglLayersQuery.isError}
      skeletonClassName="w-full h-5"
    >
      {!!mapboxLayersQuery?.data?.data && !!deckglLayersQuery?.data?.data && (
        <ul>
          {[
            //
            ...(mapboxLayersQuery.data.data as Required<MapboxLayerListResponseDataItem>[]),
            ...(deckglLayersQuery.data.data as Required<DeckGlLayerListResponseDataItem>[]),
          ].map((l) => {
            if (!l.id || !l.attributes) return null;
            return <LayersItem key={l.id} {...l} />;
          })}
        </ul>
      )}
    </ContentLoader>
  );
}

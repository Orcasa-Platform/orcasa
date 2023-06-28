'use client';

import { useGetLayers } from '@/types/generated/layer';
import { LayerListResponseDataItem } from '@/types/generated/strapi.schemas';

import LayersItem from '@/containers/home/datasets/layers/item';

import ContentLoader from '@/components/ui/loader';

export default function LayersList({ datasetId }: { datasetId: number }) {
  const { data, isFetching, isFetched, isPlaceholderData, isError } = useGetLayers({
    filters: {
      dataset: datasetId,
    },
  });

  return (
    <ContentLoader
      data={data?.data}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
      skeletonClassName="w-full h-5"
    >
      {data?.data && (
        <ul>
          {data.data.map((l) => {
            if (!l.id || !l.attributes) return null;
            return <LayersItem key={l.id} {...(l as Required<LayerListResponseDataItem>)} />;
          })}
        </ul>
      )}
    </ContentLoader>
  );
}

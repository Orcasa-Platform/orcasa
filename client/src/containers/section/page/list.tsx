'use client';

import { LayerGroupListResponseDataItem } from '@/types/generated/strapi.schemas';

import { useLayerGroups } from '@/hooks/layer-groups';
import { usePage } from '@/hooks/pages';

import ContentLoader from '@/components/ui/loader';

import LayerGroup from './item';

export default function LayerGroupList({ pageId }: { pageId: number }) {
  const { layerGroupIds, isFetching, isFetched, isPlaceholderData, isError } = usePage(pageId);
  const { groups } = useLayerGroups(layerGroupIds);

  return (
    <ContentLoader
      data={groups}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      {groups?.map((g) => {
        return <LayerGroup key={g.id} {...(g as Required<LayerGroupListResponseDataItem>)} />;
      })}
    </ContentLoader>
  );
}

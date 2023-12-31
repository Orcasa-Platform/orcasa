'use client';

import { useGetLayerGroups } from '@/types/generated/layer-group';

export const useLayerGroups = (layerGroupIds: number[]) => {
  const query = useGetLayerGroups({
    populate: '*',
    sort: 'order:asc',
    filters: { id: { $in: layerGroupIds } },
  });
  return {
    ...query,
    groups: query.data?.data,
  };
};

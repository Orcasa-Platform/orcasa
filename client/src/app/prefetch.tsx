import { dehydrate } from '@tanstack/query-core';

import getQueryClient from '@/lib/react-query';

import { getGetLayerGroupsQueryOptions } from '@/types/generated/layer-group';
export async function prefetchQueries() {
  // Prefetch layer-groups
  const queryClient = getQueryClient();
  const { queryKey, queryFn } = getGetLayerGroupsQueryOptions({ populate: '*' });

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
  return dehydrate(queryClient);
}

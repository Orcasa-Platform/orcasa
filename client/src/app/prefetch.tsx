import { dehydrate } from '@tanstack/query-core';

import getQueryClient from '@/lib/react-query';

import { getGetDatasetsQueryOptions } from '@/types/generated/dataset';
export async function prefetchQueries() {
  // Prefetch datasets
  const queryClient = getQueryClient();
  const { queryKey, queryFn } = getGetDatasetsQueryOptions({ populate: '*' });

  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
  return dehydrate(queryClient);
}

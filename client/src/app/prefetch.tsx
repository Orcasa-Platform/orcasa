import { dehydrate } from '@tanstack/query-core';

import env from '@/env.mjs';

import getQueryClient from '@/lib/react-query';

export async function prefetchQueries() {
  // Prefetch datasets
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['/datasets', { populate: '*' }],
    queryFn: async () => {
      const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/datasets?populate=*`);
      return res.json();
    },
  });
  return dehydrate(queryClient);
}

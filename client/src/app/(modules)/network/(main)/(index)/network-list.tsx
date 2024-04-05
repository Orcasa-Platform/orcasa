'use client';

import { useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

import type { useNetworks } from '@/hooks/networks';

import ContentLoader from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

import Network from './network';

export default function NetworkList({
  networks,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
  hasNextPage,
  fetchNextPage,
}: ReturnType<typeof useNetworks>) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <ContentLoader
      data={networks}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      {!networks?.length && (
        <p className="py-8 text-center text-white">No results based on your search criteria</p>
      )}
      <ul>
        {networks?.map((g) => {
          return (
            <Network
              key={`network-${g.type}-${g.id}`}
              {...(g as Required<
                ProjectListResponseDataItem &
                  OrganizationListResponseDataItem & {
                    type: 'project' | 'organization';
                    isWorldwide: boolean;
                  }
              >)}
            />
          );
        })}
      </ul>
      {hasNextPage && <Skeleton ref={ref} className="h-[232px] w-full" />}
    </ContentLoader>
  );
}

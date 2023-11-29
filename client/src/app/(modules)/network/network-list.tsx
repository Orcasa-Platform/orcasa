'use client';

import { useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

import type { useNetworks } from '@/hooks/networks';

import { Button } from '@/components/ui/button';
import ContentLoader from '@/components/ui/loader';

import Network from './network';

export default function NetworkList({
  networks,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
  hasNextPage,
  isFetchingNextPage,
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
        <p className="py-8 text-center font-semibold text-slate-500">
          No results based on your search criteria
        </p>
      )}
      <ul>
        {networks?.map((g) => {
          return (
            <Network
              key={`network-${g.type}-${g.id}`}
              {...(g as Required<
                ProjectListResponseDataItem &
                  OrganizationListResponseDataItem & { type: 'project' | 'organization' }
              >)}
            />
          );
        })}
      </ul>
      <Button
        ref={ref}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        className="mx-auto mt-8 flex"
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load more'
          : 'Nothing more to load'}
      </Button>
    </ContentLoader>
  );
}

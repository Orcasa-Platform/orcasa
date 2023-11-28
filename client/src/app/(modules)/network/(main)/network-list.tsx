'use client';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

import type { useNetworks } from '@/hooks/networks';

import ContentLoader from '@/components/ui/loader';

import Network from './network';

export default function NetworkList({
  networks,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
}: ReturnType<typeof useNetworks>) {
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
    </ContentLoader>
  );
}
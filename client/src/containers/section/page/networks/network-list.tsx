'use client';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

import type { NetworkResponse } from '@/hooks/networks';

import ContentLoader from '@/components/ui/loader';

import Network from './network';

export default function NetworkList({
  networks,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
}: NetworkResponse) {
  return (
    <ContentLoader
      data={networks}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      {networks?.map((g) => {
        return (
          <Network
            key={g.id}
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

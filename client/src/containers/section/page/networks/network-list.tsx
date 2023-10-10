'use client';

import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

import type { NetworkResponse } from '@/hooks/networks';

import type { OpenDetails } from '@/containers/section/page/pages/network';

import ContentLoader from '@/components/ui/loader';

import Network from './network';

export default function NetworkList({
  networks,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
  setOpenDetails,
}: NetworkResponse & {
  setOpenDetails: (details: OpenDetails) => void;
}) {
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
            setOpenDetails={setOpenDetails}
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

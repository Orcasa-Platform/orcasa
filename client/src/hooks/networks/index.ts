import { useGetOrganizations } from '@/types/generated/organization';
import { useGetProjects } from '@/types/generated/project';
import {
  ProjectListResponseDataItem,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

export type NetworkResponse = {
  networks: OrganizationListResponseDataItem[] | ProjectListResponseDataItem[];
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

export const useNetworks = ({ page = 1 }: { page: number }) => {
  const {
    data: organizationsData,
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  } = useGetOrganizations({
    populate: '*',
    'pagination[page]': page,
    'pagination[pageSize]': 5,
    sort: 'name:asc',
  });

  const {
    data: projectsData,
    isFetching: projectsIsFetching,
    isFetched: projectsIsFetched,
    isPlaceholderData: projectsIsPlaceholderData,
    isError: projectsIsError,
  } = useGetProjects({
    populate: '*',
    'pagination[page]': page,
    'pagination[pageSize]': 5,
    sort: 'name:asc',
  });

  const networks = [
    ...(organizationsData?.data?.map((d: OrganizationListResponseDataItem) => ({
      ...d,
      type: 'organization',
    })) || []),
    ...(projectsData?.data?.map((d: ProjectListResponseDataItem) => ({ ...d, type: 'project' })) ||
      []),
  ];

  return {
    networks,
    count: {
      organizations: organizationsData?.meta?.pagination?.total || 0,
      projects: projectsData?.meta?.pagination?.total || 0,
    },
    isFetching: organizationIsFetching || projectsIsFetching,
    isFetched: organizationIsFetched || projectsIsFetched,
    isPlaceholderData: organizationIsPlaceholderData || projectsIsPlaceholderData,
    isError: organizationIsError || projectsIsError,
  };
};

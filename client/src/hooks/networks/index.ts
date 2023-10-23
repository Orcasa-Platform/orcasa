import { useGetOrganizations } from '@/types/generated/organization';
import { useGetProjects } from '@/types/generated/project';
import {
  ProjectListResponseDataItem,
  ProjectListResponse,
  OrganizationListResponse,
  OrganizationListResponseDataItem,
} from '@/types/generated/strapi.schemas';

export type NetworkResponse = {
  networks: OrganizationListResponseDataItem[] | ProjectListResponseDataItem[];
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

type GroupedNetworks = {
  [key: string]: {
    id: number | undefined;
    name: string | undefined;
    type: string;
    countryLat: number;
    countryLong: number;
  }[];
};

export type NetworkMapResponse = {
  data: GroupedNetworks;
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

export const useMapNetworks: () => NetworkMapResponse = () => {
  const {
    data: organizationsData,
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  } = useGetOrganizations({
    populate: 'country',
  });

  const {
    data: projectsData,
    isFetching: projectsIsFetching,
    isFetched: projectsIsFetched,
    isPlaceholderData: projectsIsPlaceholderData,
    isError: projectsIsError,
  } = useGetProjects({
    populate: 'country_of_coordination',
  });

  type Data = ProjectListResponse | OrganizationListResponse | undefined;
  type ParsedData = {
    id: number | undefined;
    type: string;
    name: string | undefined;
    countryISO: string | undefined;
    countryLat: number;
    countryLong: number;
  };

  const parseData = (data: Data, type: string): ParsedData[] => {
    if (!data?.data) return [];
    return data.data
      ?.map((d) => {
        const countryData =
          type === 'organization'
            ? (d as OrganizationListResponseDataItem).attributes?.country
            : (d as ProjectListResponseDataItem).attributes?.country_of_coordination;
        if (!countryData?.data?.attributes) return null;
        return {
          id: d.id,
          type: type,
          name: d.attributes?.name,
          countryISO: countryData?.data?.attributes?.iso_3,
          countryLat: countryData?.data?.attributes?.lat,
          countryLong: countryData?.data?.attributes?.long,
        };
      })
      .filter((d): d is ParsedData => d !== null);
  };

  const parsedOrganizations = parseData(organizationsData, 'organization');
  const parsedProjects = parseData(projectsData, 'project');
  const networks = [...(parsedOrganizations || []), ...(parsedProjects || [])];

  const data: GroupedNetworks = networks.reduce((acc: GroupedNetworks, network) => {
    const { countryISO } = network;
    if (typeof countryISO === 'undefined') return acc;
    if (!acc[countryISO]) {
      acc[countryISO] = [];
    }
    acc[countryISO].push(network);
    return acc;
  }, {});

  return {
    data,
    isFetching: organizationIsFetching || projectsIsFetching,
    isFetched: organizationIsFetched || projectsIsFetched,
    isPlaceholderData: organizationIsPlaceholderData || projectsIsPlaceholderData,
    isError: organizationIsError || projectsIsError,
  };
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
    // TODO: This is a hack to get all organizations for demo purposes. Remember to put it back to 5.
    'pagination[pageSize]': 1000,
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
    // TODO: This is a hack to get all organizations for demo purposes. Remember to put it back to 5.
    'pagination[pageSize]': 1000,
    sort: 'name:asc',
  });

  const sortAlphabetically = (
    a: OrganizationListResponseDataItem | ProjectListResponseDataItem,
    b: OrganizationListResponseDataItem | ProjectListResponseDataItem,
  ) => (a.attributes?.name ?? '').localeCompare(b.attributes?.name ?? '');

  const networks = [
    ...(organizationsData?.data?.map((d: OrganizationListResponseDataItem) => ({
      ...d,
      type: 'organization',
    })) || []),
    ...(projectsData?.data?.map((d: ProjectListResponseDataItem) => ({ ...d, type: 'project' })) ||
      []),
  ].sort(sortAlphabetically);

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

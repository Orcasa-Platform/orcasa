import { PointFeature } from 'supercluster';

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

export type OrganizationProperties = {
  id: number | undefined;
  name: string | undefined;
  type: 'organization';
  countryLat: number;
  countryLong: number;
};

export type ProjectProperties = {
  id: number | undefined;
  name: string | undefined;
  type: 'project';
  countryLat: number;
  countryLong: number;
};

type GroupedNetworks = {
  [key: string]: (OrganizationProperties | ProjectProperties)[];
};

type NetworkProperties = {
  countryName: string;
  organizations: OrganizationProperties[];
  projects: ProjectProperties[];
};

type PointFeatureWithNetworkProperties = PointFeature<NetworkProperties>;

export type NetworkMapResponse = {
  features: PointFeatureWithNetworkProperties[];
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
    type: 'project' | 'organization';
    name: string | undefined;
    countryISO: string | undefined;
    countryName: string | undefined;
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
          countryName: countryData?.data?.attributes?.name,
          countryLat: countryData?.data?.attributes?.lat,
          countryLong: countryData?.data?.attributes?.long,
        };
      })
      .filter((d): d is ParsedData => d !== null);
  };

  const parsedOrganizations = parseData(organizationsData, 'organization');
  const parsedProjects = parseData(projectsData, 'project');
  const networks = [...(parsedOrganizations || []), ...(parsedProjects || [])];

  const groupedNetworks: GroupedNetworks = networks.reduce((acc: GroupedNetworks, network) => {
    const { countryName } = network;
    if (typeof countryName === 'undefined') return acc;
    if (!acc[countryName]) {
      acc[countryName] = [];
    }
    acc[countryName].push(network);
    return acc;
  }, {});

  const features: PointFeatureWithNetworkProperties[] =
    groupedNetworks &&
    Object.entries(groupedNetworks)
      .filter(([, networks]) => networks && networks.length > 0)
      .map(([countryName, networks]) => {
        if (!networks || (networks.length === 0 && typeof networks === 'undefined')) {
          return null;
        }
        const organizations = networks?.filter((network) => network?.type === 'organization');
        const projects = networks?.filter((network) => network?.type === 'project');

        return {
          type: 'Feature',
          properties: {
            countryName,
            organizations,
            projects,
          },
          geometry: {
            type: 'Point',
            coordinates: [networks[0]?.countryLong, networks[0]?.countryLat],
          },
        };
      })
      .filter((feature): feature is PointFeatureWithNetworkProperties => feature !== null);

  return {
    features,
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

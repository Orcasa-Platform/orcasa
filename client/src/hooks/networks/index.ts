import { GeoJSONSourceRaw } from 'react-map-gl/maplibre';

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

export type NetworkMapResponse = {
  data: GeoJSONSourceRaw;
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
    countryLat: number | undefined;
    countryLong: number | undefined;
  };
  const parseData = (data: Data, type: string): ParsedData[] => {
    if (!data?.data) return [];
    return data.data?.map((d) => {
      const countryData =
        type === 'organization'
          ? (d as OrganizationListResponseDataItem).attributes?.country
          : (d as ProjectListResponseDataItem).attributes?.country_of_coordination;
      return {
        id: d.id,
        type: type,
        name: d.attributes?.name,
        countryISO: countryData?.data?.attributes?.iso_3,
        countryLat: countryData?.data?.attributes?.lat,
        countryLong: countryData?.data?.attributes?.long,
      };
    });
  };

  const parsedOrganizations = parseData(organizationsData, 'organization');
  const parsedProjects = parseData(projectsData, 'project');
  const networks = [...(parsedOrganizations || []), ...(parsedProjects || [])];
  type CountryCoordinates = {
    [key: string]: {
      lat: number | undefined;
      long: number | undefined;
    };
  };

  type GroupedNetworks = {
    [key: string]: {
      id: number | undefined;
      name: string | undefined;
      type: string;
    }[];
  };

  const countryCoordinates: CountryCoordinates = {};
  const groupedNetworks: GroupedNetworks = networks.reduce((acc: GroupedNetworks, network) => {
    const countryIso = network.countryISO;
    if (typeof countryIso === 'undefined') return acc;
    if (!acc[countryIso]) {
      acc[countryIso] = [];
    }
    acc[countryIso].push(network);
    if (!countryCoordinates[countryIso]) {
      countryCoordinates[countryIso] = {
        lat: network.countryLat,
        long: network.countryLong,
      };
    }
    return acc;
  }, {});

  const data: GeoJSONSourceRaw = {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: Object.keys(groupedNetworks).map((key) => {
        const organizations = groupedNetworks[key].filter((n) => n.type === 'organization');
        const projects = groupedNetworks[key].filter((n) => n.type === 'project');
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [countryCoordinates[key].long, countryCoordinates[key].lat],
          },
          properties: {
            organizations: organizations.map((o) => ({ id: o.id, name: o.name })),
            organizationsCount: organizations.length,
            projects: projects.map((p) => ({ id: p.id, name: p.name })),
            projectsCount: projects.length,
          },
        };
      }),
    },
  };

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

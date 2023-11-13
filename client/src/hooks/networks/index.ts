import { uniqBy } from 'lodash';
import { PointFeature } from 'supercluster';

import { NetworkFilters } from '@/store/network';

import { useGetOrganizationsId, useGetOrganizations } from '@/types/generated/organization';
import { useGetProjects, useGetProjectsId } from '@/types/generated/project';
import {
  ProjectListResponseDataItem,
  ProjectResponse,
  OrganizationResponse,
  OrganizationListResponseDataItem,
  OrganizationLeadProjectsDataItem,
  OrganizationPartnerProjectsDataItem,
  OrganizationFundedProjectsDataItem,
} from '@/types/generated/strapi.schemas';

import {
  ORGANIZATION_KEYS,
  PROJECT_KEYS,
  parseData,
  parseOrganization,
  parseProject,
  ParsedData,
  getPopulateForFilters,
  getParsedData,
  getCountryData,
} from '@/hooks/networks/utils';

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

type NetworkMapResponse = {
  features: PointFeatureWithNetworkProperties[];
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

export type Network = {
  type: 'organization' | 'project';
  id: number | undefined;
};

export type PointFeatureWithNetworkProperties = PointFeature<NetworkProperties>;

export type NetworkResponse = {
  networks: OrganizationListResponseDataItem[] | ProjectListResponseDataItem[];
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

const useGetNetworksRelations = ({ id, type }: Network) => {
  const useFunction = type === 'organization' ? useGetOrganizationsId : useGetProjectsId;
  const populate = getPopulateForFilters(type);
  const {
    data,
    isFetching: networkIsFetching,
    isFetched: networkIsFetched,
    isPlaceholderData: networkIsPlaceholderData,
    isError: networkIsError,
  } = useFunction(
    id as number,
    {
      populate,
    },
    { query: { keepPreviousData: true } },
  );

  let organizationsData: ParsedData[] = [];
  let projectsData: ParsedData[] = [];

  const processProjectData = (
    data:
      | OrganizationLeadProjectsDataItem
      | OrganizationPartnerProjectsDataItem
      | OrganizationFundedProjectsDataItem,
    iterations: number,
  ) => {
    if (!data) return;

    // Add project data to projects in map
    const projectCountryData = getCountryData(data as ProjectListResponseDataItem, 'project');
    if (!projectCountryData) return;
    projectsData.push(getParsedData(data, 'project', projectCountryData));

    if (iterations > 0) {
      // Handle lead_partner, partners, funders organizations from the main project
      PROJECT_KEYS.forEach((orgKey) => {
        const organizationKeyData = data?.attributes?.[orgKey]?.data;
        if (organizationKeyData) {
          (Array.isArray(organizationKeyData)
            ? organizationKeyData
            : [organizationKeyData]
          ).forEach((orgData) => {
            processOrganizationData(orgData, iterations - 1);
          });
        }
      });
    }
  };

  const processOrganizationData = (data: OrganizationListResponseDataItem, iterations: number) => {
    if (!data) return;
    // Add organization data to organizations in map
    const countryData = getCountryData(data, 'organization');
    if (!countryData) return;
    organizationsData.push(getParsedData(data, 'organization', countryData));

    if (iterations > 0) {
      // Handle lead_projects, partner_projects, funded_projects from the main organization
      ORGANIZATION_KEYS.forEach((key) => {
        data?.attributes?.[key]?.data?.forEach((d) => processProjectData(d, iterations - 1));
      });
    }
  };

  if (data) {
    if (type === 'organization') {
      const mainData = data?.data as OrganizationListResponseDataItem;

      if (mainData) {
        // Push main organization data and traverse two levels deep
        processOrganizationData(mainData, 2);

        organizationsData = uniqBy(organizationsData, 'id');
      }
    } else if (type === 'project') {
      const mainData = data?.data as ProjectListResponseDataItem;
      if (mainData) {
        // Push main project data and traverse two levels deep
        processProjectData(mainData, 2);

        projectsData = uniqBy(projectsData, 'id');
      }
    }
  }

  return {
    projectsData,
    organizationsData,
    isFetching: networkIsFetching,
    isFetched: networkIsFetched,
    isPlaceholderData: networkIsPlaceholderData,
    isError: networkIsError,
  };
};

const useGetNetworks = (filters: NetworkFilters) => {
  const loadOrganizations = !filters.type?.length || filters.type.includes('organization');
  const loadProjects = !filters.type?.length || filters.type.includes('project');

  const {
    data: organizationsData,
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  } = useGetOrganizations(
    {
      populate: 'country',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['map-organization', filters],
        enabled: loadOrganizations,
        keepPreviousData: true,
      },
    },
  );

  const {
    data: projectsData,
    isFetching: projectsIsFetching,
    isFetched: projectsIsFetched,
    isPlaceholderData: projectsIsPlaceholderData,
    isError: projectsIsError,
  } = useGetProjects(
    {
      populate: 'country_of_coordination',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['map-project', filters],
        enabled: loadProjects,
        keepPreviousData: true,
      },
    },
  );

  return {
    organizationsData: loadOrganizations ? parseData(organizationsData, 'organization') : [],
    projectsData: loadProjects ? parseData(projectsData, 'project') : [],
    isFetching: organizationIsFetching || projectsIsFetching,
    isFetched: organizationIsFetched || projectsIsFetched,
    isPlaceholderData: organizationIsPlaceholderData || projectsIsPlaceholderData,
    isError: organizationIsError || projectsIsError,
  };
};

const getMapNetworks = ({
  projectsData,
  organizationsData,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
}: ReturnType<typeof useGetNetworks | typeof useGetNetworksRelations>) => {
  const networks = [...(organizationsData || []), ...(projectsData || [])];

  const groupedNetworks: GroupedNetworks = networks.reduce((acc: GroupedNetworks, network) => {
    const { countryName } = network;

    if (typeof countryName === 'undefined') {
      return acc;
    }

    if (!acc[countryName]) {
      acc[countryName] = [];
    }

    acc[countryName].push(network);

    return acc;
  }, {});

  const features: PointFeatureWithNetworkProperties[] = groupedNetworks
    ? Object.entries(groupedNetworks)
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
        .filter((feature): feature is PointFeatureWithNetworkProperties => feature !== null)
    : [];

  return {
    features,
    isFetching,
    isFetched,
    isError,
    isPlaceholderData,
  };
};

export const useMapNetworks = ({
  filters = {},
}: {
  filters?: NetworkFilters;
}): NetworkMapResponse => getMapNetworks(useGetNetworks(filters));

export const useMapNetworksRelations = (network: Network): NetworkMapResponse =>
  getMapNetworks(useGetNetworksRelations(network));

export const useNetworkDiagram = ({
  type,
  id,
}: {
  type: 'project' | 'organization';
  id: number;
}) => {
  const useFunction = type === 'organization' ? useGetOrganizationsId : useGetProjectsId;
  const populate =
    type === 'organization'
      ? String([
          'lead_projects',
          'lead_projects.lead_partner',
          'lead_projects.partners',
          'lead_projects.funders',
          'partner_projects',
          'partner_projects.lead_partner',
          'partner_projects.partners',
          'partner_projects.funders',
          'funded_projects',
          'funded_projects.lead_partner',
          'funded_projects.partners',
          'funded_projects.funders',
        ])
      : String([
          'lead_partner',
          'lead_partner.lead_projects',
          'lead_partner.partner_projects',
          'lead_partner.funded_projects',
          'partners',
          'partners.lead_projects',
          'partners.partner_projects',
          'partners.funded_projects',
          'funders',
          'funders.lead_projects',
          'funders.partner_projects',
          'funders.funded_projects',
        ]);
  const {
    data,
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  } = useFunction(
    id,
    {
      populate,
    },
    { query: { keepPreviousData: true } },
  );

  const parsedData =
    type === 'organization'
      ? parseOrganization(data as OrganizationResponse)
      : parseProject(data as ProjectResponse);

  return {
    data: parsedData.flat(),
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  };
};

export const useNetworks = ({
  page = 1,
  filters = {},
}: {
  page: number;
  filters?: NetworkFilters;
}) => {
  const loadOrganizations = !filters.type?.length || filters.type.includes('organization');
  const loadProjects = !filters.type?.length || filters.type.includes('project');

  const {
    data: organizationsData,
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  } = useGetOrganizations(
    {
      populate: '*',
      'pagination[page]': page,
      // TODO: This is a hack to get all organizations for demo purposes. Remember to put it back to 5.
      'pagination[pageSize]': 1000,
      sort: 'name:asc',
    },
    {
      query: {
        queryKey: ['organization', page, filters],
        keepPreviousData: true,
        enabled: loadOrganizations,
      },
    },
  );

  const {
    data: projectsData,
    isFetching: projectsIsFetching,
    isFetched: projectsIsFetched,
    isPlaceholderData: projectsIsPlaceholderData,
    isError: projectsIsError,
  } = useGetProjects(
    {
      populate: '*',
      'pagination[page]': page,
      // TODO: This is a hack to get all organizations for demo purposes. Remember to put it back to 5.
      'pagination[pageSize]': 1000,
      sort: 'name:asc',
    },
    {
      query: {
        queryKey: ['project', page, filters],
        keepPreviousData: true,
        enabled: loadProjects,
      },
    },
  );

  const sortAlphabetically = (
    a: OrganizationListResponseDataItem | ProjectListResponseDataItem,
    b: OrganizationListResponseDataItem | ProjectListResponseDataItem,
  ) => (a.attributes?.name ?? '').localeCompare(b.attributes?.name ?? '');

  const networks = [
    ...(loadOrganizations
      ? organizationsData?.data?.map((d: OrganizationListResponseDataItem) => ({
          ...d,
          type: 'organization',
        })) ?? []
      : []),
    ...(loadProjects
      ? projectsData?.data?.map((d: ProjectListResponseDataItem) => ({ ...d, type: 'project' })) ??
        []
      : []),
  ].sort(sortAlphabetically);

  return {
    networks,
    isFetching: organizationIsFetching || projectsIsFetching,
    isFetched: organizationIsFetched || projectsIsFetched,
    isPlaceholderData: organizationIsPlaceholderData || projectsIsPlaceholderData,
    isError: organizationIsError || projectsIsError,
  };
};

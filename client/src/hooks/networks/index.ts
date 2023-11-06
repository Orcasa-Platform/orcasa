import { uniqBy } from 'lodash';
import { PointFeature } from 'supercluster';

import { useGetOrganizationsId, useGetOrganizations } from '@/types/generated/organization';
import { useGetProjects, useGetProjectsId } from '@/types/generated/project';
import {
  ProjectListResponseDataItem,
  ProjectResponse,
  OrganizationResponse,
  OrganizationListResponseDataItem,
  OrganizationLeadProjectsDataItem,
  ProjectLeadPartnerData,
  ProjectCountryOfCoordinationDataAttributes,
  OrganizationCountryDataAttributes,
} from '@/types/generated/strapi.schemas';

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

import {
  ORGANIZATION_KEYS,
  PROJECT_KEYS,
  parseData,
  parseOrganization,
  parseProject,
  ParsedData,
} from '@/hooks/networks/utils';

export type NetworkResponse = {
  networks: OrganizationListResponseDataItem[] | ProjectListResponseDataItem[];
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

const useGetOrganizationsWithFilters = (filters: Filters | undefined) => {
  const { id, type } = filters || {};
  const useFunction = type === 'organization' ? useGetOrganizationsId : useGetProjectsId;
  const populate =
    type === 'organization'
      ? String([
          'country',
          'lead_projects.country_of_coordination',
          'lead_projects.lead_partner.country',
          'lead_projects.partners.country',
          'lead_projects.funders.country',
          'partner_projects.country_of_coordination',
          'partner_projects.lead_partner.country',
          'partner_projects.partners.country',
          'partner_projects.funders.country',
          'funded_projects.country_of_coordination',
          'funded_projects.lead_partner.country',
          'funded_projects.partners.country',
          'funded_projects.funders.country',
        ])
      : String([
          'country_of_coordination',
          'lead_partner.country',
          'lead_partner.lead_projects.country_of_coordination',
          'lead_partner.partner_projects.country_of_coordination',
          'lead_partner.funded_projects.country_of_coordination',
          'partners.country',
          'partners.lead_project.country_of_coordination',
          'partners.partner_projects.country_of_coordination',
          'partners.funded_projects.country_of_coordination',
          'funders.country',
          'funders.lead_projects.country_of_coordination',
          'funders.partner_projects.country_of_coordination',
          'funders.funded_projects.country_of_coordination',
        ]);
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

  const getParsedData: (
    d:
      | OrganizationListResponseDataItem
      | OrganizationLeadProjectsDataItem
      | ProjectListResponseDataItem
      | ProjectLeadPartnerData,
    type: 'organization' | 'project',
    countryD: OrganizationCountryDataAttributes | ProjectCountryOfCoordinationDataAttributes,
  ) => ParsedData = (d, type, countryD) => ({
    id: d.id,
    type: type,
    name: d.attributes?.name,
    countryISO: countryD?.iso_3,
    countryName: countryD?.name,
    countryLat: countryD?.lat || 0,
    countryLong: countryD?.long || 0,
  });

  if (data) {
    if (type === 'organization') {
      const mainData = data?.data as OrganizationListResponseDataItem;
      const countryData = mainData?.attributes?.country?.data?.attributes;
      if (mainData && countryData) {
        organizationsData.push(getParsedData(mainData, 'organization', countryData));
        ORGANIZATION_KEYS.forEach((key) => {
          mainData?.attributes?.[key]?.data?.forEach((d) => {
            const projectCountryData = d?.attributes?.country_of_coordination?.data?.attributes;
            projectsData.push(getParsedData(d, 'project', projectCountryData));

            PROJECT_KEYS.forEach((orgKey) => {
              const orgsData = d?.attributes?.[orgKey]?.data;
              if (orgsData) {
                (Array.isArray(orgsData) ? orgsData : [orgsData]).forEach((orgData) => {
                  const orgCountryData = orgData.attributes?.country?.data?.attributes;
                  organizationsData.push(getParsedData(orgData, 'organization', orgCountryData));
                });
              }
            });
          });
        });
        organizationsData = uniqBy(organizationsData, 'id');
      }
    } else if (type === 'project') {
      const mainData = data?.data as ProjectListResponseDataItem;
      const countryData = mainData?.attributes?.country_of_coordination?.data?.attributes;
      if (countryData) {
        projectsData.push(getParsedData(mainData, 'project', countryData));
      }
      PROJECT_KEYS.forEach((key) => {
        const keyData = mainData?.attributes?.[key]?.data;
        (Array.isArray(keyData) ? keyData : [keyData]).forEach((organization) => {
          if (organization) {
            const orgCountryData = organization?.attributes?.country?.data?.attributes;
            organizationsData.push(getParsedData(organization, 'organization', orgCountryData));

            ORGANIZATION_KEYS.forEach((projectKey) => {
              const orgProjectsData = organization?.attributes?.[projectKey]?.data;
              if (orgProjectsData) {
                (Array.isArray(orgProjectsData) ? orgProjectsData : [orgProjectsData]).forEach(
                  (projectData) => {
                    if (projectData) {
                      const projectCountryData =
                        projectData.attributes?.country_of_coordination?.data?.attributes;
                      projectsData.push(getParsedData(projectData, 'project', projectCountryData));
                    }
                  },
                );
              }
            });
          }
        });
      });
      projectsData = uniqBy(projectsData, 'id');
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

const useGetNetwork = () => {
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
    { query: { keepPreviousData: true } },
  );

  const {
    data: projectsData,
    isFetching: projectsIsFetching,
    isFetched: projectsIsFetched,
    isPlaceholderData: projectsIsPlaceholderData,
    isError: projectsIsError,
  } = useGetProjects({
    populate: 'country_of_coordination',
    'pagination[pageSize]': 9999,
  });

  return {
    projectsData: parseData(organizationsData, 'organization'),
    organizationsData: parseData(projectsData, 'project'),
    isFetching: organizationIsFetching || projectsIsFetching,
    isFetched: organizationIsFetched || projectsIsFetched,
    isPlaceholderData: organizationIsPlaceholderData || projectsIsPlaceholderData,
    isError: organizationIsError || projectsIsError,
  };
};

const useGetMapNetworkData = (filters: Filters | undefined) => {
  const { type } = filters || {};
  const getNetworksFunction = !!type ? useGetOrganizationsWithFilters : useGetNetwork;
  return getNetworksFunction(filters);
};

type NetworkMapResponse = {
  features: PointFeatureWithNetworkProperties[];
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

export type Filters = {
  type: 'organization' | 'project';
  id: number | undefined;
};

export const useMapNetworks: (filters?: Filters) => NetworkMapResponse = (filters) => {
  const { projectsData, organizationsData, isFetched, isFetching, isPlaceholderData, isError } =
    useGetMapNetworkData(filters);

  const networks = [...(organizationsData || []), ...(projectsData || [])];
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
    isFetching,
    isFetched,
    isError,
    isPlaceholderData,
  };
};

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

export const useNetworks = ({ page = 1 }: { page: number }) => {
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
    { query: { keepPreviousData: true } },
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
    { query: { keepPreviousData: true } },
  );

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

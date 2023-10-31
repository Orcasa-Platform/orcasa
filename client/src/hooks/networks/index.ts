import { PointFeature } from 'supercluster';

import { useGetOrganizationsId, useGetOrganizations } from '@/types/generated/organization';
import { useGetProjects, useGetProjectsId } from '@/types/generated/project';
import {
  ProjectListResponseDataItem,
  ProjectResponse,
  OrganizationResponse,
  OrganizationListResponse,
  OrganizationLeadProjectsDataItem,
  OrganizationPartnerProjectsDataItem,
  OrganizationFundedProjectsDataItem,
  ProjectListResponse,
  OrganizationListResponseDataItem,
  ProjectLeadPartnerData,
  ProjectPartnersDataItem,
  ProjectFundersDataItem,
  OrganizationResponseDataObject,
  ProjectResponseDataObject,
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
    'pagination[pageSize]': 9999,
  });

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

export type Category = 'coordinator' | 'partner' | 'funder';

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

  type OrganizationKey = 'lead_projects' | 'partner_projects' | 'funded_projects';
  type ProjectKey = 'lead_partner' | 'partners' | 'funders';

  const ORGANIZATION_KEYS: OrganizationKey[] = [
    'lead_projects',
    'partner_projects',
    'funded_projects',
  ];
  const PROJECT_KEYS: ProjectKey[] = ['lead_partner', 'partners', 'funders'];

  const getCategory: (category: ProjectKey | OrganizationKey) => Category = (category) =>
    ({
      lead_projects: 'coordinator',
      partner_projects: 'partner',
      funded_projects: 'funder',
      lead_partner: 'coordinator',
      partners: 'partner',
      funders: 'funder',
    }[category] as Category);

  const getProjectData = (
    key: OrganizationKey,
    project:
      | OrganizationLeadProjectsDataItem
      | OrganizationPartnerProjectsDataItem
      | OrganizationFundedProjectsDataItem,
  ) => ({
    id: project.id,
    name: project?.attributes?.name,
    type: 'project',
    category: getCategory(key),
  });

  const getOrganizationData = (
    key: ProjectKey,
    org: ProjectLeadPartnerData | ProjectPartnersDataItem | ProjectFundersDataItem,
    // Skip the grandparent project so it doesn't show up twice
    skipProjectId?: number,
  ) => ({
    id: org.id,
    name: org?.attributes?.name,
    type: 'organization',
    category: getCategory(key),
    children: ORGANIZATION_KEYS.map((organizationKey: OrganizationKey) => {
      const child = org?.attributes?.[organizationKey]?.data;
      if (!child) return [];
      return (Array.isArray(child) ? child : [child]).map(
        (c) => c.id !== skipProjectId && getProjectData(organizationKey, c),
      );
    })
      .flat()
      .filter(Boolean),
  });

  const parseOrganization = (organizationData: OrganizationResponse) => {
    if (!organizationData) return [];
    const { attributes, id: parentId }: OrganizationResponseDataObject =
      organizationData?.data || {};

    return ORGANIZATION_KEYS.map((key) => {
      if (typeof attributes === 'undefined') return null;
      return attributes[key]?.data?.map(
        (
          project:
            | OrganizationLeadProjectsDataItem
            | OrganizationPartnerProjectsDataItem
            | OrganizationFundedProjectsDataItem,
        ) => ({
          id: project.id,
          name: project?.attributes?.name,
          type: 'project',
          category: getCategory(key),
          children: PROJECT_KEYS.map((projectKey: ProjectKey) => {
            const child = project?.attributes?.[projectKey]?.data;
            if (!child) return [];
            return (Array.isArray(child) ? child : [child]).map((c) => {
              if (c.id !== parentId) return getOrganizationData(projectKey, c);
            });
          })
            .flat()
            .filter(Boolean),
        }),
      );
    });
  };

  const parseProject = (projectData: ProjectResponse) => {
    if (!projectData) return [];
    const { attributes, id: parentProjectId }: ProjectResponseDataObject = projectData?.data || {};
    return PROJECT_KEYS.map((key) => {
      if (typeof attributes === 'undefined') {
        return null;
      }
      if (key === 'lead_partner') {
        if (!attributes[key]?.data) return [];
        return getOrganizationData(
          key,
          attributes[key]?.data as ProjectLeadPartnerData,
          parentProjectId,
        );
      }
      return attributes[key]?.data?.map((d) => getOrganizationData(key, d, parentProjectId));
    });
  };

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

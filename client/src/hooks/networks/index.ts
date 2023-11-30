import { useMemo } from 'react';

import { uniqBy } from 'lodash';
import { PointFeature } from 'supercluster';

import { NetworkFilters, NetworkOrganizationFilters, NetworkProjectFilters } from '@/store/network';

import { useGetAreaOfInterventions } from '@/types/generated/area-of-intervention';
import { useGetCountries } from '@/types/generated/country';
import { useGetOrganizationsId, useGetOrganizations } from '@/types/generated/organization';
import { useGetOrganizationThemes } from '@/types/generated/organization-theme';
import { useGetOrganizationTypes } from '@/types/generated/organization-type';
import { useGetProjects, useGetProjectsId } from '@/types/generated/project';
import { useGetProjectTypes } from '@/types/generated/project-type';
import { useGetRegions } from '@/types/generated/region';
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

export enum NetworkProjectStatusFilter {
  Active,
  Finished,
  NotStarted,
}

const ACCEPTED_STATUS_FILTER = {
  $or: [
    {
      publication_status: { $eq: 'accepted' },
    },
    { publication_status: { $null: true } },
  ],
};

const getQueryFilters = (filters: NetworkFilters) => {
  const generalFilters =
    typeof filters.search !== 'undefined' && filters.search.length > 0
      ? [
          {
            $or: [
              {
                name: {
                  $containsi: filters.search,
                },
              },
              {
                short_description: {
                  $containsi: filters.search,
                },
              },
              {
                description: {
                  $containsi: filters.search,
                },
              },
            ],
          },
        ]
      : [];

  const organizationFilters = [
    ...(filters.organizationType.length > 0
      ? [
          {
            $or: filters.organizationType.map((id) => ({
              organization_type: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.thematic.length > 0
      ? [
          {
            $or: filters.thematic
              .map((id) => [
                {
                  main_organization_theme: {
                    id: {
                      $eq: id,
                    },
                  },
                },
                {
                  secondary_organization_theme: {
                    id: {
                      $eq: id,
                    },
                  },
                },
              ])
              .flat(),
          },
        ]
      : []),
    ...(filters.country.length > 0
      ? [
          {
            $or: filters.country.map((id) => ({
              country: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
  ];

  const projectFilters = [
    ...(filters.projectType.length > 0
      ? [
          {
            $or: filters.projectType.map((id) => ({
              project_type: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.status.length > 0
      ? [
          {
            $or: filters.status.map((id) => {
              if (id === NetworkProjectStatusFilter.Active) {
                return {
                  $and: [
                    {
                      start_date: {
                        $lte: new Date().toISOString().split('T')[0],
                      },
                    },
                    {
                      $or: [
                        {
                          end_date: {
                            $null: true,
                          },
                        },
                        {
                          end_date: {
                            $gt: new Date().toISOString().split('T')[0],
                          },
                        },
                      ],
                    },
                  ],
                };
              } else if (id === NetworkProjectStatusFilter.Finished) {
                return {
                  $and: [
                    {
                      end_date: {
                        $notNull: true,
                      },
                    },
                    {
                      end_date: {
                        $lte: new Date().toISOString().split('T')[0],
                      },
                    },
                  ],
                };
              } else if (id === NetworkProjectStatusFilter.NotStarted) {
                return {
                  start_date: {
                    $gt: new Date().toISOString().split('T')[0],
                  },
                };
              }
            }),
          },
        ]
      : []),
    ...(filters.coordinationCountry.length > 0
      ? [
          {
            $or: filters.coordinationCountry.map((id) => ({
              country_of_coordination: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.interventionRegion.length > 0
      ? [
          {
            $or: filters.interventionRegion.map((id) => ({
              region_of_interventions: {
                id: {
                  $in: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.interventionCountry.length > 0
      ? [
          {
            $or: filters.interventionCountry.map((id) => ({
              country_of_interventions: {
                id: {
                  $in: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.interventionArea.length > 0
      ? [
          {
            $or: filters.interventionArea
              .map((id) => [
                {
                  main_area_of_intervention: {
                    id: {
                      $eq: id,
                    },
                  },
                },
                {
                  secondary_area_of_intervention: {
                    id: {
                      $eq: id,
                    },
                  },
                },
                {
                  third_area_of_intervention: {
                    id: {
                      $eq: id,
                    },
                  },
                },
              ])
              .flat(),
          },
        ]
      : []),
  ];

  return {
    organization: {
      $and: [...generalFilters, ...organizationFilters, ACCEPTED_STATUS_FILTER],
    },
    project: {
      $and: [...generalFilters, ...projectFilters, ACCEPTED_STATUS_FILTER],
    },
  };
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

  const queryFilters = getQueryFilters(filters);

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
      filters: queryFilters.organization,
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
      filters: queryFilters.project,
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

export const useMapNetworks = ({ filters }: { filters: NetworkFilters }): NetworkMapResponse =>
  getMapNetworks(useGetNetworks(filters));

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

export const useNetworks = ({ page = 1, filters }: { page: number; filters: NetworkFilters }) => {
  const loadOrganizations = !filters.type?.length || filters.type.includes('organization');
  const loadProjects = !filters.type?.length || filters.type.includes('project');

  const queryFilters = getQueryFilters(filters);

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
      filters: queryFilters.organization,
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
      filters: queryFilters.project,
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

export const useNetworkOrganizationFiltersOptions = (): Record<
  keyof NetworkOrganizationFilters,
  { label: string; value: number }[]
> => {
  const { data: countryData } = useGetCountries(
    {
      fields: 'name',
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['countries'],
      },
    },
  );

  const country = useMemo(
    () =>
      countryData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          countryData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [countryData],
  );

  const { data: organizationTypeData } = useGetOrganizationTypes(
    {
      fields: 'name',
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['organization-types'],
      },
    },
  );

  const organizationType = useMemo(
    () =>
      organizationTypeData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          organizationTypeData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [organizationTypeData],
  );

  const { data: organizationThemeData } = useGetOrganizationThemes(
    {
      fields: 'name',
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['organization-themes'],
      },
    },
  );

  const thematic = useMemo(
    () =>
      organizationThemeData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          organizationThemeData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [organizationThemeData],
  );

  return {
    organizationType,
    thematic,
    country,
  };
};

export const useNetworkProjectFiltersOptions = (): Record<
  keyof NetworkProjectFilters,
  { label: string; value: number }[]
> => {
  const { data: countryData } = useGetCountries(
    {
      fields: 'name',
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['countries'],
      },
    },
  );

  const country = useMemo(
    () =>
      countryData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          countryData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [countryData],
  );

  const { data: projectTypeData } = useGetProjectTypes(
    {
      fields: 'name',
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['project-types'],
      },
    },
  );

  const projectType = useMemo(
    () =>
      projectTypeData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          projectTypeData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [projectTypeData],
  );

  const { data: regionData } = useGetRegions(
    {
      fields: 'name',
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['regions'],
      },
    },
  );

  const region = useMemo(
    () =>
      regionData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          regionData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [regionData],
  );

  const { data: interventionAreaData } = useGetAreaOfInterventions(
    {
      fields: 'name',
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['intervention-areas'],
      },
    },
  );

  const interventionArea = useMemo(
    () =>
      interventionAreaData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          interventionAreaData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [interventionAreaData],
  );

  return {
    coordinationCountry: country,
    interventionCountry: country,
    interventionRegion: region,
    interventionArea,
    projectType,
    status: [
      { label: 'Active', value: NetworkProjectStatusFilter.Active },
      { label: 'Finished', value: NetworkProjectStatusFilter.Finished },
      { label: 'Not started', value: NetworkProjectStatusFilter.NotStarted },
    ],
  };
};

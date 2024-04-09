import { useCallback, useEffect, useMemo } from 'react';

import { UseFormReturn } from 'react-hook-form';

import { FetchNextPageOptions } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import { useDebounce } from 'rooks';
import { PointFeature } from 'supercluster';

import {
  NetworkFilters,
  NetworkOrganizationFilters,
  NetworkProjectFilters,
  useNetworkFilters,
} from '@/store/network';

import { useGetAreaOfInterventions } from '@/types/generated/area-of-intervention';
import { useGetCountries } from '@/types/generated/country';
import {
  useGetOrganizations,
  useGetOrganizationsId,
  useGetOrganizationsInfinite,
} from '@/types/generated/organization';
import { useGetOrganizationThemes } from '@/types/generated/organization-theme';
import { useGetOrganizationTypes } from '@/types/generated/organization-type';
import {
  useGetProjects,
  useGetProjectsId,
  useGetProjectsInfinite,
} from '@/types/generated/project';
import { useGetProjectTypes } from '@/types/generated/project-type';
import { useGetRegions } from '@/types/generated/region';
import {
  AreaOfInterventionListResponseDataItem,
  OrganizationFundedProjectsDataItem,
  OrganizationLeadProjectsDataItem,
  OrganizationListResponse,
  OrganizationListResponseDataItem,
  OrganizationPartnerProjectsDataItem,
  OrganizationResponse,
  ProjectListResponse,
  ProjectListResponseDataItem,
  ProjectResponse,
} from '@/types/generated/strapi.schemas';

import {
  getCountryData,
  getParsedData,
  getPopulateForFilters,
  ORGANIZATION_KEYS,
  parseData,
  ParsedData,
  parseOrganization,
  parseProject,
  PROJECT_KEYS,
} from '@/hooks/networks/utils';

import { sortByOrderAndName } from './utils';

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

export type NetworkProperties = {
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
    ...(filters.year.length > 0
      ? [
          {
            $or: filters.year.map((value) => {
              return {
                $and: [
                  {
                    start_date: {
                      $lte: `${value}-12-31`,
                    },
                  },
                  {
                    end_date: {
                      $gte: `${value}-01-01`,
                    },
                  },
                ],
              };
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
  const useFunction = type === 'organization' ? useGetOrganizations : useGetProjects;
  const filterPublicationStatus = { filters: { publication_status: { $eq: 'accepted' } } };
  const populate =
    type === 'organization'
      ? {
          lead_projects: {
            ...filterPublicationStatus,
            populate: {
              lead_partner: filterPublicationStatus,
              partners: filterPublicationStatus,
              funders: filterPublicationStatus,
            },
          },
          partner_projects: {
            ...filterPublicationStatus,
            populate: {
              lead_partner: filterPublicationStatus,
              partners: filterPublicationStatus,
              funders: filterPublicationStatus,
            },
          },
          funded_projects: {
            ...filterPublicationStatus,
            populate: {
              lead_partner: filterPublicationStatus,
              partners: filterPublicationStatus,
              funders: filterPublicationStatus,
            },
          },
        }
      : {
          lead_partner: {
            ...filterPublicationStatus,
            populate: {
              lead_projects: filterPublicationStatus,
              partner_projects: filterPublicationStatus,
              funded_projects: filterPublicationStatus,
            },
          },
          partners: {
            ...filterPublicationStatus,
            populate: {
              lead_projects: filterPublicationStatus,
              partner_projects: filterPublicationStatus,
              funded_projects: filterPublicationStatus,
            },
          },
          funders: {
            ...filterPublicationStatus,
            populate: {
              lead_projects: filterPublicationStatus,
              partner_projects: filterPublicationStatus,
              funded_projects: filterPublicationStatus,
            },
          },
        };
  const {
    data,
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  } = useFunction(
    {
      populate,
      filters: {
        $and: [
          {
            id: {
              $eq: id,
            },
          },
        ],
      },
    },
    {
      query: { keepPreviousData: true },
    },
  );

  const parsedData =
    type === 'organization'
      ? parseOrganization(data?.data?.[0] && ({ data: data?.data?.[0] } as OrganizationResponse))
      : parseProject(data?.data?.[0] && ({ data: data?.data?.[0] } as ProjectResponse));

  return {
    data: parsedData.flat(),
    isFetching: organizationIsFetching,
    isFetched: organizationIsFetched,
    isPlaceholderData: organizationIsPlaceholderData,
    isError: organizationIsError,
  };
};

export const useRegionsCount = () => {
  const { data, isFetching, isFetched, isPlaceholderData, isError } = useGetRegions({
    fields: ['id'],
    'pagination[pageSize]': 1,
  });
  return {
    data: data?.meta?.pagination?.total ?? -1,
    isFetching,
    isFetched,
    isPlaceholderData,
    isError,
  };
};

export const useNetworks = ({
  size = 20,
  filters,
  regionsCount,
}: {
  size?: number;
  filters: NetworkFilters;
  regionsCount: {
    data: number;
    isFetching: boolean;
    isFetched: boolean;
    isPlaceholderData: boolean;
    isError: boolean;
  };
}) => {
  const loadOrganizations = !filters.type?.length || filters.type.includes('organization');
  const loadProjects = !filters.type?.length || filters.type.includes('project');

  const queryFilters = getQueryFilters(filters);

  const getNextPageParam = (lastPage: OrganizationListResponse | ProjectListResponse) => {
    const page = lastPage.meta?.pagination?.page ?? 1;
    const pageSize = Math.floor(size / 2);
    const total = lastPage.meta?.pagination?.total ?? Infinity;

    return page * pageSize < total ? page + 1 : undefined;
  };

  const {
    data: organizationsData,
    isFetching: organizationsIsFetching,
    isFetched: organizationsIsFetched,
    isPlaceholderData: organizationsIsPlaceholderData,
    isError: organizationsIsError,
    hasNextPage: organizationsHasNextPage,
    isFetchingNextPage: organizationsIsFetchingNextPage,
    fetchNextPage: organizationsFetchNextPage,
  } = useGetOrganizationsInfinite(
    {
      populate: '*',
      'pagination[pageSize]': Math.floor(size / 2),
      sort: 'name:asc',
      filters: queryFilters.organization,
    },
    {
      query: {
        queryKey: ['organization', filters],
        keepPreviousData: true,
        enabled: loadOrganizations,
        getNextPageParam,
      },
    },
  );

  const {
    data: projectsData,
    isFetching: projectsIsFetching,
    isFetched: projectsIsFetched,
    isPlaceholderData: projectsIsPlaceholderData,
    isError: projectsIsError,
    hasNextPage: projectsHasNextPage,
    isFetchingNextPage: projectsIsFetchingNextPage,
    fetchNextPage: projectsFetchNextPage,
  } = useGetProjectsInfinite(
    {
      populate: '*',
      'pagination[pageSize]': Math.floor(size / 2),
      sort: 'name:asc',
      filters: queryFilters.project,
    },
    {
      query: {
        queryKey: ['project', filters],
        keepPreviousData: true,
        enabled: loadProjects,
        getNextPageParam,
      },
    },
  );

  const networks = useMemo(() => {
    type Networks = (
      | (OrganizationListResponseDataItem & { type: 'organization' })
      | (ProjectListResponseDataItem & { type: 'project'; isWorldwide: boolean })
    )[];

    const sortAlphabetically = (a: Networks[0], b: Networks[0]) =>
      (a.attributes?.name ?? '').localeCompare(b.attributes?.name ?? '');

    // Maximum number of pages of results
    const maxPagesCounts = Math.max(
      loadOrganizations ? organizationsData?.pages.length ?? 0 : 0,
      loadProjects ? projectsData?.pages.length ?? 0 : 0,
    );

    let res: Networks = [];

    for (let i = 0, j = maxPagesCounts; i < j; i++) {
      const organizations = loadOrganizations ? organizationsData?.pages?.[i]?.data ?? [] : [];
      const projects = loadProjects ? projectsData?.pages?.[i]?.data ?? [] : [];

      // We sort the results page by page so that the sorting is stable when new pages are fetched
      res = [
        ...res,
        ...[
          ...(organizations.map((organization) => ({
            ...organization,
            type: 'organization',
          })) as Networks),
          ...(projects.map((project) => ({
            ...project,
            type: 'project',
            isWorldwide:
              project?.attributes?.region_of_interventions?.data?.length === regionsCount.data,
          })) as Networks),
        ].sort(sortAlphabetically),
      ];
    }

    return res;
  }, [organizationsData, projectsData, loadOrganizations, loadProjects, regionsCount.data]);

  return {
    networks,
    fetchNextPage: (options?: FetchNextPageOptions) => {
      if (organizationsHasNextPage && loadOrganizations) {
        organizationsFetchNextPage(options);
      }

      if (projectsHasNextPage && loadProjects) {
        projectsFetchNextPage(options);
      }
    },
    hasNextPage: organizationsHasNextPage || projectsHasNextPage,
    isFetchingNextPage: organizationsIsFetchingNextPage || projectsIsFetchingNextPage,
    isFetching: organizationsIsFetching || projectsIsFetching || regionsCount.isFetching,
    isFetched: organizationsIsFetched || projectsIsFetched || regionsCount.isFetched,
    isPlaceholderData:
      organizationsIsPlaceholderData || projectsIsPlaceholderData || regionsCount.isPlaceholderData,
    isError: organizationsIsError || projectsIsError || regionsCount.isError,
  };
};

export const useNetworksCount = (filters: NetworkFilters) => {
  const loadOrganizations = !filters.type?.length || filters.type.includes('organization');
  const loadProjects = !filters.type?.length || filters.type.includes('project');

  const queryFilters = getQueryFilters(filters);

  const { data: organizationsData } = useGetOrganizations(
    {
      fields: ['id'],
      'pagination[pageSize]': 1,
      filters: queryFilters.organization,
    },
    {
      query: {
        queryKey: ['organization', 'count', filters],
        keepPreviousData: true,
        enabled: loadOrganizations,
      },
    },
  );

  const { data: projectsData } = useGetProjects(
    {
      fields: ['id'],
      'pagination[pageSize]': 9999,
      filters: queryFilters.project,
    },
    {
      query: {
        queryKey: ['project', 'count', filters],
        keepPreviousData: true,
        enabled: loadProjects,
      },
    },
  );

  return {
    organisation: organizationsData?.meta?.pagination?.total ?? 0,
    project: projectsData?.meta?.pagination?.total ?? 0,
  };
};

export const useNetworkOrganizationFiltersOptions = (): Record<
  keyof NetworkOrganizationFilters,
  { label: string; value: number; description?: string }[]
> => {
  const { data: countryData } = useGetCountries(
    {
      fields: ['name'],
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
      fields: ['name', 'order'],
      // Sort will be done later as the undefined values need to be moved to the top
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
          organizationTypeData.data
            .sort(sortByOrderAndName)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [organizationTypeData],
  );

  const { data: organizationThemeData } = useGetOrganizationThemes(
    {
      fields: ['name', 'order'],
      // Sort will be done later as the undefined values need to be moved to the top
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
          organizationThemeData.data
            .sort(sortByOrderAndName)
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map((d) => ({ label: d.attributes!.name, value: d.id! }))
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
  { label: string; value: number; description?: string }[]
> => {
  const { data: countryData } = useGetCountries(
    {
      fields: ['name'],
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
      fields: ['name', 'description'],
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
        ? projectTypeData.data.map((d) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            label: d.attributes!.name,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            value: d.id!,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            description: d.attributes!.description,
          }))
        : [],
    [projectTypeData],
  );

  const { data: regionData } = useGetRegions(
    {
      fields: ['name'],
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
      fields: ['name'],
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
        ? interventionAreaData.data.map((d: AreaOfInterventionListResponseDataItem) => ({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            label: d.attributes!.name,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            value: d.id!,
          }))
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
    // NOTE: 2010 is the hard-coded start year for the filter
    year: Array.from({ length: new Date().getFullYear() - 2010 + 1 }).map((_, index) => ({
      label: `${2010 + index}`,
      value: 2010 + index,
    })),
  };
};

export const useNetworkActiveFilters = () => {
  const organizationFiltersOptions = useNetworkOrganizationFiltersOptions();
  const projectFiltersOptions = useNetworkProjectFiltersOptions();
  const [filters] = useNetworkFilters();

  return Object.entries(filters)
    .map(([key, value]: [string, unknown[]]) => {
      const options =
        organizationFiltersOptions[key as keyof NetworkOrganizationFilters] ??
        projectFiltersOptions[key as keyof NetworkProjectFilters];

      // If all the options of a filter are active, it's the same as if the filter is not applied,
      // so we ignore it
      if (!options || options.length === value.length) {
        return [];
      }

      return value
        .map((filterValue) => {
          const option = options?.find(({ value }) => value === filterValue);
          if (option) {
            return {
              filter: key,
              label: option.label,
              value: option.value,
            };
          }
        })
        .filter((filter) => filter?.value !== undefined && filter?.value !== null) as {
        filter: string;
        label: string;
        value: number;
      }[];
    })
    .flat();
};

/**
 * Immediately validate a field based on a custom validation function
 */
export const useValidate = (
  { watch, setError, clearErrors }: UseFormReturn,
  field: string,
  validateFunction: (fieldValue: string | undefined) => Promise<boolean>,
  message: string,
  debounce = 250,
) => {
  const fieldValue = watch(field);

  const validate = useCallback(async () => {
    let isValid = true;
    try {
      isValid = !(await validateFunction(fieldValue));
    } catch {}

    if (isValid) {
      clearErrors(field);
    } else {
      setError(field, { type: 'custom', message });
    }
  }, [validateFunction, fieldValue, clearErrors, field, setError, message]);

  const debouncedValidate = useDebounce(validate, debounce);

  useEffect(() => {
    debouncedValidate();
  }, [fieldValue, message, debouncedValidate]);
};

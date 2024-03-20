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
  ProjectCountryOfCoordinationDataAttributes,
  OrganizationCountryDataAttributes,
  OrganizationTypeListResponseDataItem,
  OrganizationThemeListResponseDataItem,
  CountryListResponseDataItem,
} from '@/types/generated/strapi.schemas';

export type Category = 'coordinator' | 'partner' | 'funder';

type Data = ProjectListResponse | OrganizationListResponse | undefined;

export type ParsedData = {
  id: number | undefined;
  type: 'project' | 'organization';
  name: string | undefined;
  countryName: string | undefined;
  countryLat: number;
  countryLong: number;
};

// Projects in each organization
export const ORGANIZATION_KEYS: OrganizationKey[] = [
  'lead_projects',
  'partner_projects',
  'funded_projects',
];
type OrganizationKey = 'lead_projects' | 'partner_projects' | 'funded_projects';

// Organizations in each project
export const PROJECT_KEYS: ProjectKey[] = ['lead_partner', 'partners', 'funders'];

type ProjectKey = 'lead_partner' | 'partners' | 'funders';

export const ACCEPTED_STATUS_FILTER = {
  publication_status: { $eq: 'accepted' },
};

export const getPopulateForFilters = (type: 'organization' | 'project' | undefined) =>
  type === 'organization'
    ? {
        country: { populate: true },
        lead_projects: {
          populate: {
            country_of_coordination: {
              populate: true,
            },
            lead_partner: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            partners: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            funders: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
          },
          filters: ACCEPTED_STATUS_FILTER,
        },
        partner_projects: {
          populate: {
            country_of_coordination: {
              populate: true,
            },
            lead_partner: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            partners: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            funders: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
          },
          filters: ACCEPTED_STATUS_FILTER,
        },
        funded_projects: {
          populate: {
            country_of_coordination: {
              populate: true,
            },
            lead_partner: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            partners: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            funders: {
              populate: ['country'],
              filters: ACCEPTED_STATUS_FILTER,
            },
          },
          filters: ACCEPTED_STATUS_FILTER,
        },
      }
    : {
        country_of_coordination: {
          populate: true,
        },
        lead_partner: {
          populate: {
            country: {
              populate: true,
            },
            lead_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            partner_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            funded_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
          },
          filters: ACCEPTED_STATUS_FILTER,
        },
        partners: {
          populate: {
            country: {
              populate: true,
            },
            lead_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            partner_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            funded_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
          },
          filters: ACCEPTED_STATUS_FILTER,
        },
        funders: {
          populate: {
            country: {
              populate: true,
            },
            lead_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            partner_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
            funded_projects: {
              populate: ['country_of_coordination'],
              filters: ACCEPTED_STATUS_FILTER,
            },
          },
          filters: ACCEPTED_STATUS_FILTER,
        },
      };

// Get country data from the organization or project
export const getCountryData = (
  d: OrganizationListResponseDataItem | ProjectListResponseDataItem,
  type: 'organization' | 'project',
) =>
  type === 'organization'
    ? (d as OrganizationListResponseDataItem)?.attributes?.country?.data?.attributes
    : (d as ProjectListResponseDataItem)?.attributes?.country_of_coordination?.data?.attributes;

// Get only important data for the map
export const getParsedData: (
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
  countryName: countryD?.name,
  countryLat: countryD?.lat || 0,
  countryLong: countryD?.long || 0,
});

// Parse data for each organization or project arrays
export const parseData = (data: Data, type: 'organization' | 'project'): ParsedData[] => {
  if (!data?.data) return [];
  return (Array.isArray(data.data) ? data.data : [data.data])
    ?.map((d) => {
      const countryData = getCountryData(d, type);
      if (!countryData) return null;
      return getParsedData(d, type, countryData);
    })
    .filter((d): d is ParsedData => d !== null);
};

// Get the category of the organization or project for the chart
const getCategory = (category: ProjectKey | OrganizationKey): Category =>
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

export const parseOrganization = (organizationData: OrganizationResponse | undefined) => {
  if (!organizationData) return [];
  const { attributes, id: parentId }: OrganizationResponseDataObject = organizationData?.data || {};

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

export const parseProject = (projectData: ProjectResponse | undefined) => {
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

export const sortByOrderAndName = (
  a:
    | OrganizationTypeListResponseDataItem
    | OrganizationThemeListResponseDataItem
    | CountryListResponseDataItem
    | ProjectListResponseDataItem,
  b:
    | OrganizationTypeListResponseDataItem
    | OrganizationThemeListResponseDataItem
    | CountryListResponseDataItem
    | ProjectListResponseDataItem,
) => {
  // If orders are equal, sort by name
  if (
    !a?.attributes ||
    !('order' in a?.attributes) ||
    !b?.attributes ||
    !('order' in b?.attributes) ||
    a?.attributes?.order === b?.attributes?.order
  ) {
    if (!b.attributes?.name) return 0;
    return a.attributes?.name.localeCompare(b.attributes?.name) ?? 0;
  }
  // Default sort by order
  return (a?.attributes?.order || 0) - (b?.attributes?.order || 0);
};

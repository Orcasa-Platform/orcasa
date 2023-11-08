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
} from '@/types/generated/strapi.schemas';

export type Category = 'coordinator' | 'partner' | 'funder';

type Data = ProjectListResponse | OrganizationListResponse | undefined;

export const getPopulateForFilters = (type: 'organization' | 'project' | undefined) =>
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
  countryISO: countryD?.iso_3,
  countryName: countryD?.name,
  countryLat: countryD?.lat || 0,
  countryLong: countryD?.long || 0,
});

export const parseData = (data: Data, type: string): ParsedData[] => {
  if (!data?.data) return [];
  return (
    data.data &&
    (Array.isArray(data.data) ? data.data : [data.data])
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
      .filter((d): d is ParsedData => d !== null)
  );
};

export type ParsedData = {
  id: number | undefined;
  type: 'project' | 'organization';
  name: string | undefined;
  countryISO: string | undefined;
  countryName: string | undefined;
  countryLat: number;
  countryLong: number;
};

type OrganizationKey = 'lead_projects' | 'partner_projects' | 'funded_projects';
type ProjectKey = 'lead_partner' | 'partners' | 'funders';

export const ORGANIZATION_KEYS: OrganizationKey[] = [
  'lead_projects',
  'partner_projects',
  'funded_projects',
];
export const PROJECT_KEYS: ProjectKey[] = ['lead_partner', 'partners', 'funders'];

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

export const parseOrganization = (organizationData: OrganizationResponse) => {
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

export const parseProject = (projectData: ProjectResponse) => {
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

import { useGetAreaOfInterventions } from '@/types/generated/area-of-intervention';
import { useGetCountries } from '@/types/generated/country';
import { useGetOrganizations } from '@/types/generated/organization';
import { useGetOrganizationThemes } from '@/types/generated/organization-theme';
import { useGetOrganizationTypes } from '@/types/generated/organization-type';
import { useGetProjects } from '@/types/generated/project';
import { useGetProjectTypes } from '@/types/generated/project-type';
import { useGetRegions } from '@/types/generated/region';
import {
  OrganizationThemeListResponse,
  OrganizationTypeListResponse,
  CountryListResponse,
  ProjectListResponse,
  ProjectTypeListResponse,
} from '@/types/generated/strapi.schemas';
import { useGetSustainableDevGoals } from '@/types/generated/sustainable-dev-goal';

export const useOrganizationGetFormFields = () => {
  const requestObject = {
    fields: 'name',
    sort: 'name',
    'pagination[pageSize]': 9999,
  };

  const { data: organizationTypesData } = useGetOrganizationTypes(requestObject, {
    query: {
      queryKey: ['organization-types'],
    },
  });

  const { data: organizationThemeData } = useGetOrganizationThemes(requestObject, {
    query: {
      queryKey: ['organization-themes'],
    },
  });

  const { data: countryData } = useGetCountries(requestObject, {
    query: {
      queryKey: ['countries'],
    },
  });

  const { data: projects } = useGetProjects(requestObject, {
    query: {
      queryKey: ['projects'],
    },
  });

  if (
    typeof organizationTypesData === 'undefined' ||
    typeof organizationThemeData === 'undefined' ||
    typeof countryData === 'undefined' ||
    typeof projects === 'undefined'
  ) {
    return;
  }
  const parseData = (
    data:
      | OrganizationTypeListResponse
      | OrganizationThemeListResponse
      | CountryListResponse
      | ProjectListResponse,
  ) => {
    return data?.data
      ?.map(
        (d) =>
          d.attributes && {
            name: d.attributes.name,
            id: d.id,
          },
      )
      .filter((d): d is { name: string; id: number } => typeof d !== 'undefined')
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  const organizationTypes = parseData(organizationTypesData);
  return {
    organizationTypes,
    organizationThemes: parseData(organizationThemeData),
    countries: parseData(countryData),
    projects: parseData(projects),
    otherOrganizationTypesId: organizationTypes
      ?.find((type) => type?.name === 'Other')
      ?.id.toString(),
  };
};

export const useProjectFormGetFields = () => {
  const requestObject = {
    fields: 'name',
    sort: 'name',
    'pagination[pageSize]': 9999,
  };

  const { data: regions } = useGetRegions(requestObject, {
    query: {
      queryKey: ['regions'],
    },
  });

  const { data: areasOfIntervention } = useGetAreaOfInterventions(requestObject, {
    query: {
      queryKey: ['areas-of-intervention'],
    },
  });
  const { data: sustainableDevelopmentGoals } = useGetSustainableDevGoals(requestObject, {
    query: {
      queryKey: ['sustainable-development-goals'],
    },
  });

  const { data: countryData } = useGetCountries(requestObject, {
    query: {
      queryKey: ['countries'],
    },
  });

  const { data: organizations } = useGetOrganizations(requestObject, {
    query: {
      queryKey: ['organizations'],
    },
  });

  const { data: projectTypes } = useGetProjectTypes(requestObject, {
    query: {
      queryKey: ['project-types'],
    },
  });

  if (
    typeof regions === 'undefined' ||
    typeof areasOfIntervention === 'undefined' ||
    typeof sustainableDevelopmentGoals === 'undefined' ||
    typeof countryData === 'undefined' ||
    typeof organizations === 'undefined' ||
    typeof projectTypes === 'undefined'
  ) {
    return;
  }
  const parseData = (
    data:
      | OrganizationTypeListResponse
      | OrganizationThemeListResponse
      | CountryListResponse
      | ProjectListResponse
      | ProjectTypeListResponse,
  ) => {
    return data?.data
      ?.map(
        (d) =>
          d.attributes && {
            name: d.attributes.name,
            id: d.id,
          },
      )
      .filter((d): d is { name: string; id: number } => typeof d !== 'undefined')
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return {
    regions: parseData(regions),
    areasOfIntervention: parseData(areasOfIntervention),
    countries: parseData(countryData),
    organizations: parseData(organizations),
    sustainableDevelopmentGoals: parseData(sustainableDevelopmentGoals),
    projectTypes: parseData(projectTypes),
  };
};

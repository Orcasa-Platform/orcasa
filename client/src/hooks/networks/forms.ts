import { useGetCountries } from '@/types/generated/country';
import { useGetOrganizationThemes } from '@/types/generated/organization-theme';
import { useGetOrganizationTypes } from '@/types/generated/organization-type';
import {
  OrganizationThemeListResponse,
  OrganizationTypeListResponse,
  CountryListResponse,
} from '@/types/generated/strapi.schemas';

export const useFormGetFields = () => {
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

  if (
    typeof organizationTypesData === 'undefined' ||
    typeof organizationThemeData === 'undefined' ||
    typeof countryData === 'undefined'
  ) {
    return;
  }
  const parseData = (
    data: OrganizationTypeListResponse | OrganizationThemeListResponse | CountryListResponse,
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
    otherOrganizationTypesId: organizationTypes
      ?.find((type) => type?.name === 'Other')
      ?.id.toString(),
  };
};

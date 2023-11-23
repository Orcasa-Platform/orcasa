import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { useGetCountries } from '@/types/generated/country';
import { useGetOrganizationThemes } from '@/types/generated/organization-theme';
import { useGetOrganizationTypes } from '@/types/generated/organization-type';

export type Field = {
  label: string;
  required?: boolean;
  zod:
    | z.ZodString
    | z.ZodEnum<[string, ...string[]]>
    | z.ZodOptional<z.ZodString>
    | z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
  description?: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  options?: { label: string; value: string }[];
  maxSize?: number;
};

export const useFormGetOrganizationTypes = () => {
  const { data: organizationTypesData } = useGetOrganizationTypes(
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
  if (typeof organizationTypesData === 'undefined') {
    return;
  }
  return organizationTypesData?.data
    ?.map((organizationType) => organizationType.attributes?.name)
    .filter((organizationType) => typeof organizationType !== 'undefined') as [string, ...string[]];
};
export const useFormGetThemes = () => {
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
  if (typeof organizationThemeData === 'undefined') {
    return;
  }
  return organizationThemeData?.data
    ?.map((organizationTheme) => organizationTheme.attributes?.name)
    .filter((organizationTheme) => typeof organizationTheme !== 'undefined') as [
    string,
    ...string[],
  ];
};

export const useFormGetCountries = () => {
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
  return countryData?.data
    ?.map((country) => country.attributes?.name)
    .filter((country) => typeof country !== 'undefined') as [string, ...string[]];
};

export const useGetForm = (fields?: { [key: string]: Field } | undefined) => {
  const formSchema = z.object(
    (fields ? Object.keys(fields) : []).reduce((acc: { [key: string]: Field['zod'] }, field) => {
      if (fields) {
        acc[field] = fields[field].zod;
      }
      return acc;
    }, {}),
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  return [form, formSchema] as const;
};

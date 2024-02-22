import { useCallback, useMemo } from 'react';

import { atom, useAtom } from 'jotai';

interface NetworkGeneralFilters {
  type?: string[];
  search?: string;
}

export interface NetworkOrganizationFilters {
  organizationType: number[];
  thematic: number[];
  country: number[];
}

export interface NetworkProjectFilters {
  projectType: number[];
  status: number[];
  year: number[];
  coordinationCountry: number[];
  interventionRegion: number[];
  interventionCountry: number[];
  interventionArea: number[];
}

export type NetworkFilters = NetworkGeneralFilters &
  NetworkOrganizationFilters &
  NetworkProjectFilters;

const organizationFiltersKeys: (keyof NetworkOrganizationFilters)[] = [
  'organizationType',
  'thematic',
  'country',
];

const projectFiltersKeys: (keyof NetworkProjectFilters)[] = [
  'projectType',
  'status',
  'year',
  'coordinationCountry',
  'interventionRegion',
  'interventionCountry',
  'interventionArea',
];

const filterSidebarOpenAtom = atom(false);
export const useNetworkFilterSidebarOpen = () => {
  return useAtom(filterSidebarOpenAtom);
};

const filtersAtom = atom<NetworkFilters>({
  type: [],
  organizationType: [],
  thematic: [],
  country: [],
  projectType: [],
  status: [],
  year: [],
  coordinationCountry: [],
  interventionRegion: [],
  interventionCountry: [],
  interventionArea: [],
});

export const useNetworkFilters = () => {
  return useAtom(filtersAtom);
};

const isFormDirtyAtom = atom<boolean>(false);

export const useIsFormDirty = () => {
  return useAtom(isFormDirtyAtom);
};

export const useNetworkOrganizationFilters = () => {
  const [filters, setFilters] = useNetworkFilters();

  const organizationFilters = useMemo(
    () =>
      Object.entries(filters)
        .filter(([key]) =>
          organizationFiltersKeys.includes(key as keyof NetworkOrganizationFilters),
        )
        .reduce((res, [key, value]) => ({ ...res, [key]: value }), {}),
    [filters],
  );

  const setOrganizationFilters = useCallback(
    (organizationFilters: NetworkOrganizationFilters) =>
      setFilters((filters) => ({
        ...filters,
        ...organizationFilters,
      })),
    [setFilters],
  );

  return [organizationFilters as NetworkOrganizationFilters, setOrganizationFilters] as const;
};

export const useNetworkProjectFilters = () => {
  const [filters, setFilters] = useNetworkFilters();

  const projectFilters = useMemo(
    () =>
      Object.entries(filters)
        .filter(([key]) => projectFiltersKeys.includes(key as keyof NetworkProjectFilters))
        .reduce((res, [key, value]) => ({ ...res, [key]: value }), {}),
    [filters],
  );

  const setProjectFilters = useCallback(
    (projectFilters: NetworkProjectFilters) =>
      setFilters((filters) => ({
        ...filters,
        ...projectFilters,
      })),
    [setFilters],
  );

  return [projectFilters as NetworkProjectFilters, setProjectFilters] as const;
};

export const useFiltersCount = <
  T extends NetworkOrganizationFilters | NetworkProjectFilters | NetworkFilters,
>(
  filters: T,
  ignoreFiltersKeys: (keyof NetworkFilters)[] = [],
) => {
  return Object.keys(filters).filter((key) => {
    if (ignoreFiltersKeys.includes(key as keyof NetworkFilters)) {
      return false;
    }

    const value = filters[key as keyof T];

    let hasValue = true;
    if (Array.isArray(value) || typeof value === 'string') {
      hasValue = (value as string | unknown[]).length > 0;
    } else {
      hasValue = value !== null && value !== undefined;
    }

    return hasValue;
  }).length;
};

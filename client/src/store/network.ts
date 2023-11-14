import { useCallback, useMemo } from 'react';

import { atom, useAtom } from 'jotai';

export interface NetworkGeneralFilters {
  type?: string[];
  search?: string;
}

export interface NetworkOrganizationFilters {
  organizationType?: unknown;
  mainThematic?: unknown;
  country?: unknown;
}

export interface NetworkProjectFilters {
  projectType?: unknown;
  status?: unknown;
  coordinationCountry?: unknown;
  interventionRegion?: unknown;
  interventionCountry?: unknown;
  interventionArea?: unknown;
}

export type NetworkFilters = NetworkGeneralFilters &
  NetworkOrganizationFilters &
  NetworkProjectFilters;

const organizationFiltersKeys: (keyof NetworkOrganizationFilters)[] = [
  'organizationType',
  'mainThematic',
  'country',
];

const projectFiltersKeys: (keyof NetworkProjectFilters)[] = [
  'projectType',
  'status',
  'coordinationCountry',
  'interventionRegion',
  'interventionCountry',
  'interventionArea',
];

const filterSidebarOpenAtom = atom(false);
export const useNetworkFilterSidebarOpen = () => {
  return useAtom(filterSidebarOpenAtom);
};

const filtersAtom = atom<NetworkFilters>({ type: [] });
export const useNetworkFilters = () => {
  return useAtom(filtersAtom);
};

export const useNetworkOrganizationFilters = () => {
  const [filters, setFilters] = useNetworkFilters();

  const organizationFilters: NetworkOrganizationFilters = useMemo(
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

  return [organizationFilters, setOrganizationFilters] as const;
};

export const useNetworkProjectFilters = () => {
  const [filters, setFilters] = useNetworkFilters();

  const projectFilters: NetworkProjectFilters = useMemo(
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

  return [projectFilters, setProjectFilters] as const;
};

export const useFiltersCount = (
  filters: NetworkFilters,
  ignoreFiltersKeys: (keyof NetworkFilters)[] = [],
) => {
  return Object.keys(filters).filter((key) => {
    if (ignoreFiltersKeys.includes(key as keyof NetworkFilters)) {
      return false;
    }

    const value = filters[key as keyof NetworkFilters];

    let hasValue = true;
    if (Array.isArray(value) || typeof value === 'string') {
      hasValue = value.length > 0;
    } else {
      hasValue = value !== null && value !== undefined;
    }

    return hasValue;
  }).length;
};

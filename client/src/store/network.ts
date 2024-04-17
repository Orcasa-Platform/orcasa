import { atom, useAtom } from 'jotai';

export interface NetworkGeneralFilters {
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
      hasValue = (value as string | unknown[]).length > 0;
    } else {
      hasValue = value !== null && value !== undefined;
    }

    return hasValue;
  }).length;
};

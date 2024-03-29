import { atom, useAtom } from 'jotai';

type MainIntervention = 'Management' | 'Land Use Change';
export type SourceName = 'FAO' | 'WOCAT';

export interface PracticesDropdownFilters {
  countries: number[];
  year: number[];
  landUseTypes: number[] | undefined;
  priorLandUseTypes: number[] | undefined;
  mainIntervention: MainIntervention | undefined;
  subInterventions: number[] | undefined;
  sourceName: SourceName[];
}

export interface PracticesFilters extends PracticesDropdownFilters {
  search?: string;
}

const filterSidebarOpenAtom = atom(false);
export const usePracticesFilterSidebarOpen = () => {
  return useAtom(filterSidebarOpenAtom);
};

const filtersAtom = atom<PracticesFilters>({
  countries: [],
  year: [],
  priorLandUseTypes: undefined,
  landUseTypes: undefined,
  mainIntervention: undefined,
  subInterventions: undefined,
  sourceName: [],
});
export const usePracticesFilters = () => {
  return useAtom(filtersAtom);
};

export const useFiltersCount = (
  filters: PracticesFilters,
  ignoreFiltersKeys: (keyof PracticesFilters)[] = [],
) => {
  return Object.keys(filters).filter((key) => {
    if (ignoreFiltersKeys.includes(key as keyof PracticesFilters)) {
      return false;
    }

    const value = filters[key as keyof PracticesFilters];

    let hasValue = true;
    if (Array.isArray(value) || typeof value === 'string') {
      hasValue = (value as string | unknown[]).length > 0;
    } else {
      hasValue = value !== null && value !== undefined;
    }

    return hasValue;
  }).length;
};

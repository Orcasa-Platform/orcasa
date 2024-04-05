import { useCallback } from 'react';

import { atom, useAtom } from 'jotai';

type MainIntervention = 'Management' | 'Land Use Change';
export type SourceName = 'FAO' | 'WOCAT';

export interface PracticesDropdownFilters {
  country: number[];
  year: number[];
  landUseTypes: number[];
  priorLandUseTypes: number[];
  mainIntervention: MainIntervention | undefined;
  subInterventions: number[];
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
  country: [],
  year: [],
  priorLandUseTypes: [],
  landUseTypes: [],
  mainIntervention: undefined,
  subInterventions: [],
  sourceName: [],
});
export const usePracticesFilters = () => {
  const [filters, setInternalFilters] = useAtom(filtersAtom);

  const setFilters = useCallback(
    (newFilters: PracticesFilters) => {
      setInternalFilters({
        ...newFilters,
        // When the user changes the main intervention to `'Land Use Change'`, the current land use
        // type value is moved to the prior land use type filter
        landUseTypes:
          filters.mainIntervention !== newFilters.mainIntervention
            ? newFilters.mainIntervention === 'Land Use Change'
              ? []
              : newFilters.landUseTypes
            : newFilters.landUseTypes,
        priorLandUseTypes:
          filters.mainIntervention !== newFilters.mainIntervention
            ? newFilters.mainIntervention === 'Land Use Change'
              ? newFilters.landUseTypes
              : []
            : newFilters.priorLandUseTypes,
        // When the main intervention is set to `'Management'` and the user changes the value of the
        // main intervention filter or empties the land use type one, the sub-intervention filter is
        // emptied
        subInterventions:
          filters.mainIntervention === 'Management'
            ? filters.mainIntervention !== newFilters.mainIntervention ||
              (filters.landUseTypes.length > 0 && newFilters.landUseTypes.length === 0)
              ? undefined
              : newFilters.subInterventions
            : newFilters.subInterventions,
      } as Parameters<typeof setInternalFilters>[0]);
    },
    [filters, setInternalFilters],
  );

  return [filters, setFilters] as const;
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

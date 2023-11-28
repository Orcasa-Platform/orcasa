import { atom, useAtom } from 'jotai';

export interface DatasetsFilters {
  search?: string;
  source: string[];
  /** Format: YYYY-MM-DD */
  minDate?: string;
  /** Format: YYYY-MM-DD */
  maxDate?: string;
}

const filtersAtom = atom<DatasetsFilters>({
  source: [],
});

export const useDatasetsFilters = () => {
  return useAtom(filtersAtom);
};

export const useFiltersCount = (ignoreFiltersKeys: (keyof DatasetsFilters)[] = []) => {
  const [filters] = useDatasetsFilters();

  return Object.keys(filters).filter((key) => {
    if (ignoreFiltersKeys.includes(key as keyof DatasetsFilters)) {
      return false;
    }

    const value = filters[key as keyof DatasetsFilters];

    let hasValue = true;
    if (Array.isArray(value) || typeof value === 'string') {
      hasValue = value.length > 0;
    } else {
      hasValue = value !== null && value !== undefined;
    }

    return hasValue;
  }).length;
};

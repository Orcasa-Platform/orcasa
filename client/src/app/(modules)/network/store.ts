import { atom, useAtom } from 'jotai';

interface Filters {
  type: string[];
}

const filterSidebarOpenAtom = atom(false);
export const useFilterSidebarOpen = () => {
  return useAtom(filterSidebarOpenAtom);
};

const filtersAtom = atom<Filters>({ type: [] });
export const useFilters = () => {
  return useAtom(filtersAtom);
};

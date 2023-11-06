import { atom, useAtom } from 'jotai';

export interface NetworkFilters {
  type?: string[];
}

const filterSidebarOpenAtom = atom(false);
export const useFilterSidebarOpen = () => {
  return useAtom(filterSidebarOpenAtom);
};

const filtersAtom = atom<NetworkFilters>({ type: [] });
export const useFilters = () => {
  return useAtom(filtersAtom);
};

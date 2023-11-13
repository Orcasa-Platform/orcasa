import { atom, useAtom } from 'jotai';

export interface NetworkFilters {
  type?: string[];
  // search?: string;
}

const filterSidebarOpenAtom = atom(false);
export const useNetworkFilterSidebarOpen = () => {
  return useAtom(filterSidebarOpenAtom);
};

const filtersAtom = atom<NetworkFilters>({ type: [] });
export const useNetworkFilters = () => {
  return useAtom(filtersAtom);
};

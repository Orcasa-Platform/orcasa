import { atom, useAtom } from 'jotai';

const filterSidebarOpenAtom = atom(false);
export const useFilterSidebarOpen = () => {
  return useAtom(filterSidebarOpenAtom);
};

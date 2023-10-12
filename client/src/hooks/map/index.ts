import { useMemo, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import { useRecoilValue } from 'recoil';

import { sidebarOpenAtom } from '@/store';

const getMapPadding = (sidebarOpen: boolean) => {
  // The fallback values are based on the default size of the sidebar on the Geospatial Data module
  const navWidth = document.querySelector('.js-main-nav')?.getBoundingClientRect().width ?? 117;
  const sidebarWidth = document.querySelector('.js-sidebar')?.getBoundingClientRect().width ?? 490;

  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: sidebarOpen ? navWidth + sidebarWidth : navWidth,
  };
};

export const useMapPadding = () => {
  const sidebarOpen = useRecoilValue(sidebarOpenAtom);
  const [padding, setPadding] = useState(getMapPadding(sidebarOpen));

  const updatePadding = useMemo(
    () => debounce(() => setPadding(getMapPadding(sidebarOpen)), 250),
    [sidebarOpen],
  );

  useEffect(() => {
    updatePadding();
  }, [sidebarOpen, updatePadding]);

  useEffect(() => {
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, [updatePadding]);

  return padding;
};

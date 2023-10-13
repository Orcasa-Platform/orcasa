import { useMemo, useEffect, useState } from 'react';

import { debounce } from 'lodash';
import { useRecoilValue } from 'recoil';

import { sidebarOpenAtom } from '@/store';

// The values are based on the default size of the sidebar on the Geospatial Data module
const DEFAULT_NAV_WIDTH = 117;
const DEFAULT_SIDEBAR_WIDTH = 490;

const getMapPadding = (sidebarOpen: boolean) => {
  const isClientSide = typeof document !== 'undefined';

  const navWidth = isClientSide
    ? document.querySelector('.js-main-nav')?.getBoundingClientRect().width ?? DEFAULT_NAV_WIDTH
    : DEFAULT_NAV_WIDTH;
  const sidebarWidth = isClientSide
    ? document.querySelector('.js-sidebar')?.getBoundingClientRect().width ?? DEFAULT_SIDEBAR_WIDTH
    : DEFAULT_SIDEBAR_WIDTH;

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

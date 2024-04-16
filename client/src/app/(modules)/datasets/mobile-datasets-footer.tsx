'use client';

import dynamic from 'next/dynamic';

import { useFiltersCount } from '@/store/datasets';

import DatasetsFilters from '@/app/(modules)/datasets/filters-sidebar';

const MobileFooterMenu = dynamic(() => import('@/components/mobile-footer-menu'), {
  ssr: false,
});

const MobileDatasetsFooter = () => {
  const datasetsFiltersCount = useFiltersCount(['search']);

  return (
    <MobileFooterMenu
      variant="dark"
      buttons={[
        {
          label: 'Filters',
          count: datasetsFiltersCount,
          content: <DatasetsFilters isMobile />,
        },
      ]}
      section="datasets"
    />
  );
};

export default MobileDatasetsFooter;

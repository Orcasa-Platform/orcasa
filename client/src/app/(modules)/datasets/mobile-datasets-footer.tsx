'use client';

import { useFiltersCount } from '@/store/datasets';

import DatasetsFilters from '@/app/(modules)/datasets/filters-sidebar';

import Banner from '@/components/mobile-banner';
import MobileFooterMenu from '@/components/mobile-footer-menu';

const MobileDatasetsFooter = () => {
  const datasetsFiltersCount = useFiltersCount();

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
      banner={<Banner section="datasets" />}
    />
  );
};

export default MobileDatasetsFooter;

'use client';

import { useFiltersCount, usePracticesFilters } from '@/store/practices';

import PracticesFilters from '@/app/(modules)/practices/(main)/filters-sidebar';

import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

import Banner from '@/components/mobile-banner';
import MobileFooterMenu from '@/components/mobile-footer-menu';

import PracticesSidebar from './filters-sidebar';

export default function PracticesModuleLayout({ children }: { children: React.ReactNode }) {
  const [filters] = usePracticesFilters();
  const practicesFiltersCount = useFiltersCount(filters);

  return (
    <>
      {/* Mobile */}
      <div className="mt-[56px] h-[calc(100vh-56px)] overflow-auto bg-gray-700 pb-[60px] lg:hidden">
        {children}
      </div>
      <MobileFooterMenu
        variant="dark"
        buttons={[
          {
            label: 'Filters',
            count: practicesFiltersCount,
            content: <PracticesFilters isMobile />,
          },
        ]}
        banner={<Banner section="practices" />}
      />
      {/* Rest */}
      <div className="hidden lg:block">
        <Sidebar section="practices">
          {children}
          <div className="!mt-0">
            <PracticesSidebar />
          </div>
        </Sidebar>
        <Map />
      </div>
    </>
  );
}

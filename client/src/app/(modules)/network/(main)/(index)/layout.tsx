'use client';
import dynamic from 'next/dynamic';

import { useFiltersCount } from '@/store/network';
import { useNetworkFilters } from '@/store/network';

import NetworkFilters from '@/app/(modules)/network/(main)/(index)/filters-sidebar';

import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';
const MobileFooterMenu = dynamic(() => import('@/components/mobile-footer-menu'), {
  ssr: false,
});

import NewButtons from '@/components/new-buttons';

import FiltersSidebar from './filters-sidebar';

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  const [filters] = useNetworkFilters();
  const networkFiltersCount = useFiltersCount(filters);
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mt-[56px] h-[calc(100vh-56px)] overflow-auto bg-gray-700 p-4 pb-[60px] text-white lg:hidden">
        {children}
      </div>
      <div className="lg:hidden">
        <MobileFooterMenu
          variant="dark"
          buttons={[
            {
              label: 'Filters',
              count: networkFiltersCount,
              content: <NetworkFilters isMobile />,
            },
          ]}
          section="network"
        />
      </div>
      <div className="relative hidden flex-grow lg:block">
        <Sidebar section="network">
          {children}
          <div className="!mt-0">
            <FiltersSidebar />
          </div>
        </Sidebar>
        <Map />
      </div>
      <div className="hidden shrink-0 items-center justify-between pb-6 pl-[130px] pr-10 pt-4 text-sm text-white lg:flex">
        Help us building the soil-carbon network by adding new organisations and initiatives.
        <NewButtons className="min-w-fit space-x-4" />
      </div>
    </div>
  );
}

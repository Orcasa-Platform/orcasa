import Map from '@/containers/map';
import MobileFooter from '@/containers/mobile-footer';
import Sidebar from '@/containers/sidebar';

import NewButtons from '@/components/new-buttons';

import FiltersSidebar from './filters-sidebar';

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="mt-[56px] h-[calc(100vh-56px)] overflow-auto bg-gray-700 p-4 pb-[60px] text-white lg:hidden">
        {children}
      </div>
      <MobileFooter section="network" />
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

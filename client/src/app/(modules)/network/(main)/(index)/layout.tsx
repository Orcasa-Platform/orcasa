import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

import NewButtons from '@/components/new-buttons';

import FiltersSidebar from './filters-sidebar';

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col">
      <div className="relative flex-grow">
        <Sidebar section="network">
          {children}
          <div className="!mt-0">
            <FiltersSidebar />
          </div>
        </Sidebar>
        <Map />
      </div>
      <div className="flex shrink-0 items-center justify-between pb-6 pl-[130px] pr-10 pt-4 text-sm text-white">
        Help us building the soil-carbon network by adding new organisations and initiatives.
        <NewButtons className="min-w-fit space-x-4" />
      </div>
    </div>
  );
}

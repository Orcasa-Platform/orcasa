import Map from '@/containers/map';
import MobileFooter from '@/containers/mobile-footer';
import Sidebar from '@/containers/sidebar';

import PracticesSidebar from './filters-sidebar';
export default function PracticesModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Mobile */}
      <div className="mt-[56px] h-[calc(100vh-56px)] overflow-auto bg-gray-700 pb-[60px] lg:hidden">
        {children}
      </div>
      <MobileFooter section="practices" />
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

import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

import PracticesSidebar from './filters-sidebar';
export default function PracticesModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="h-[calc(100vh-56px)] overflow-auto bg-gray-700 lg:hidden">{children}</div>
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

import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

import PracticesSidebar from './filters-sidebar';
export default function PracticesModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar section="practices">
        {children}
        <div className="!mt-0">
          <PracticesSidebar />
        </div>
      </Sidebar>
      <Map />
    </>
  );
}

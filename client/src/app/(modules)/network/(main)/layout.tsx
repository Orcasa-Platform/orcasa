import Sidebar from '@/containers/sidebar';

import FiltersSidebar from './filters-sidebar';

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar section="network">
        {children}
        <div className="!mt-0">
          <FiltersSidebar />
        </div>
      </Sidebar>
    </>
  );
}

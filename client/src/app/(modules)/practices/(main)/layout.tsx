'use client';

import { usePathname } from 'next/navigation';

import Sidebar from '@/containers/sidebar';

import PracticesSidebar from './filters-sidebar';
export default function PracticesModuleLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Full width for the detail pages
  const isFullWidth = pathname !== '/practices';
  return (
    <>
      <Sidebar section="practices" isFullWidth={isFullWidth}>
        {children}
        <div className="!mt-0">
          <PracticesSidebar />
        </div>
      </Sidebar>
    </>
  );
}

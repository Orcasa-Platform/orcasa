'use client';

import { useEffect } from 'react';

import { ArrowLeft } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { useNetworkFilterSidebarOpen } from '@/store/network';

import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleDetailsLayout({ children }: { children: React.ReactNode }) {
  const mapSearchParams = useMapSearchParams();
  const [, setFilterSidebarOpen] = useNetworkFilterSidebarOpen();

  // We close the filter sidebar when navigating to a network's detailed view
  useEffect(() => {
    setFilterSidebarOpen(false);
  }, [setFilterSidebarOpen]);

  return (
    <>
      <div className="mt-14 h-[calc(100vh-56px)] space-y-6 overflow-auto bg-gray-700 p-4 pb-6 text-white lg:hidden">
        <SlidingLinkButton
          href={`/network?${mapSearchParams.toString()}`}
          variant="dark"
          Icon={ArrowLeft}
          scroll={false}
        >
          Back to results
        </SlidingLinkButton>
        {children}
      </div>
      <div className="hidden lg:block">
        <Sidebar section="network">
          <SlidingLinkButton
            href={`/network?${mapSearchParams.toString()}`}
            variant="dark"
            Icon={ArrowLeft}
            scroll={false}
          >
            Back to results
          </SlidingLinkButton>
          {children}
        </Sidebar>
        <Map />
      </div>
    </>
  );
}

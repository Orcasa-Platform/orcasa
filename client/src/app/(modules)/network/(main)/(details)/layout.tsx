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
      <Sidebar section="network">
        <SlidingLinkButton
          href={`/network?${mapSearchParams.toString()}`}
          Icon={ArrowLeft}
          scroll={false}
        >
          Back to Results
        </SlidingLinkButton>
        {children}
      </Sidebar>
      <Map />
    </>
  );
}

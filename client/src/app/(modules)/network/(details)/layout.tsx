'use client';

import { useEffect } from 'react';

import { ArrowLeft } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { useNetworkFilterSidebarOpen } from '@/store/network';

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
      <SlidingLinkButton
        href={`/network?${mapSearchParams.toString()}`}
        Icon={ArrowLeft}
        scroll={false}
      >
        Back to Results
      </SlidingLinkButton>
      {children}
    </>
  );
}

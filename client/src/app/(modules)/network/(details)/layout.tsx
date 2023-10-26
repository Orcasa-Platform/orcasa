'use client';

import { useEffect } from 'react';

import { ArrowLeft } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleDetailsLayout({ children }: { children: React.ReactNode }) {
  const mapSearchParams = useMapSearchParams();
  const [, setSidebarScroll] = useSidebarScrollHelpers();

  // We make sure to scroll to the top when navigating to the details view
  useEffect(() => {
    setSidebarScroll(0);
  }, [setSidebarScroll]);

  return (
    <div className="p-7">
      <SlidingLinkButton
        href={`/network?${mapSearchParams.toString()}`}
        Icon={ArrowLeft}
        scroll={false}
      >
        Back to Results
      </SlidingLinkButton>
      {children}
    </div>
  );
}

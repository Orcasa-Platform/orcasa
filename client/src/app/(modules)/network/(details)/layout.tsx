'use client';

import { ArrowLeft } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { useScrollSidebarToTop } from '@/containers/sidebar';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleDetailsLayout({ children }: { children: React.ReactNode }) {
  const mapSearchParams = useMapSearchParams();

  useScrollSidebarToTop();

  return (
    <div className="p-7">
      <SlidingLinkButton href={`/network?${mapSearchParams.toString()}`} Icon={ArrowLeft}>
        Back to Results
      </SlidingLinkButton>
      {children}
    </div>
  );
}

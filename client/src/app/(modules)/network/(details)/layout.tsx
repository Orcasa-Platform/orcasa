'use client';

import { useSearchParams } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { useScrollSidebarToTop } from '@/containers/sidebar';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleDetailsLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  useScrollSidebarToTop();

  return (
    <div className="p-7">
      <SlidingLinkButton href={`/network?${searchParams.toString()}`} Icon={ArrowLeft}>
        Back to Results
      </SlidingLinkButton>
      {children}
    </div>
  );
}

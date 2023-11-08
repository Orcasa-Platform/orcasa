'use client';

import { ArrowLeft } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleDetailsLayout({ children }: { children: React.ReactNode }) {
  const mapSearchParams = useMapSearchParams();

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

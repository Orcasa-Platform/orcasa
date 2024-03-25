'use client';

import { useEffect } from 'react';

import { ArrowLeft } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { usePracticesFilterSidebarOpen } from '@/store/practices';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function PracticeDetailsLayout({ children }: { children: React.ReactNode }) {
  const mapSearchParams = useMapSearchParams();
  const [, setFilterSidebarOpen] = usePracticesFilterSidebarOpen();

  // We close the filter sidebar when navigating to a practices's detailed view
  useEffect(() => {
    setFilterSidebarOpen(false);
  }, [setFilterSidebarOpen]);

  return (
    <>
      <SlidingLinkButton
        href={`/practices?${mapSearchParams.toString()}`}
        variant="dark"
        Icon={ArrowLeft}
        scroll={false}
      >
        Back to Results
      </SlidingLinkButton>
      {children}
    </>
  );
}

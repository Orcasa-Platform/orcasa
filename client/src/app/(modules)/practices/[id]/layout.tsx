'use client';

import { ArrowLeft } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function PracticeDetailsLayout({ children }: { children: React.ReactNode }) {
  const mapSearchParams = useMapSearchParams();

  return (
    <>
      <div className="mt-14 h-[calc(100vh-56px)] space-y-6 overflow-auto bg-gray-700 p-4 pb-6 text-white lg:hidden">
        <SlidingLinkButton
          href={`/practices?${mapSearchParams.toString()}`}
          variant="dark"
          Icon={ArrowLeft}
          scroll={false}
          buttonClassName="mr-[15px]"
        >
          Back to results
        </SlidingLinkButton>
        {children}
      </div>
      <div
        className="absolute bottom-2 left-[90px] top-2 z-20 hidden w-[calc(100%-90px)] flex-col gap-8 overflow-auto rounded-lg bg-gray-700 bg-cover bg-no-repeat p-10 text-white transition-transform duration-500 lg:flex"
        style={{ backgroundImage: `url('/images/sidebar-background-wide.svg')` }}
      >
        <SlidingLinkButton
          href={`/practices?${mapSearchParams.toString()}`}
          variant="dark"
          Icon={ArrowLeft}
          scroll={false}
          buttonClassName="mr-[15px]"
        >
          Back to results
        </SlidingLinkButton>
        {children}
      </div>
    </>
  );
}

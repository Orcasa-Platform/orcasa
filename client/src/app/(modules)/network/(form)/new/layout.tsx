import { ArrowLeft } from 'lucide-react';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-[90px] top-0 z-10 flex h-screen w-[calc(100%-90px)] justify-center overflow-auto bg-white">
      <div className="mt-10 min-w-[632px]">
        <SlidingLinkButton
          href="/network"
          Icon={ArrowLeft}
          scroll={false}
          className="fixed top-5 z-40"
        >
          Go back
        </SlidingLinkButton>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}

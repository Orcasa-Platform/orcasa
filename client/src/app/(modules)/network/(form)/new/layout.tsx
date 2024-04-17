import { ArrowLeft } from 'lucide-react';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute left-[90px] top-0 z-10 flex h-screen w-[calc(100%-90px)] justify-center overflow-auto bg-gray-700 text-white">
      <SlidingLinkButton
        href="/network"
        variant="dark"
        Icon={ArrowLeft}
        scroll={false}
        className="fixed left-[130px] top-10 z-40"
      >
        Go back
      </SlidingLinkButton>
      <div className="min-w-[500px]">{children}</div>
    </div>
  );
}

import { ArrowLeft } from 'lucide-react';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

export default function NetworkModuleDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-7">
      <SlidingLinkButton href="/network" Icon={ArrowLeft}>
        Back to Results
      </SlidingLinkButton>
      {children}
    </div>
  );
}

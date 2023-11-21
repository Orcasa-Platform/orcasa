import { ArrowLeft } from 'lucide-react';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';
export const metadata = {
  title: 'Impact4Soil - Network',
};

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 z-10 flex h-screen w-screen justify-center bg-white">
      <div className="mt-10">
        <SlidingLinkButton href="/network" Icon={ArrowLeft} scroll={false}>
          Go back
        </SlidingLinkButton>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}

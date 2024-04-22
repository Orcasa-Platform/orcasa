import Image from 'next/image';
import Link from 'next/link';

import MobileMenuButton from '@/components/mobile-menu-button';

const MobileMenuBar = () => {
  return (
    <nav className="fixed inset-0 z-50 flex h-[56px] w-full items-center justify-between border-b border-gray-600 bg-gray-700 px-6 py-4 text-white lg:hidden">
      <Link href="/" className="flex items-center justify-center gap-2 lg:gap-3">
        <Image src="/images/logo.png" width={30} height={30} alt="Impact4Soil" priority />
        <span className="font-serif">Impact4Soil</span>
        <span className="rounded bg-gray-650 px-2 py-[3px] font-sans text-xs font-normal text-white">
          Beta
        </span>
      </Link>
      <MobileMenuButton />
    </nav>
  );
};

export default MobileMenuBar;

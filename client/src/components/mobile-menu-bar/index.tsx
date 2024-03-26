import Image from 'next/image';
import Link from 'next/link';

import MobileMenuButton from '@/components/mobile-menu-button';

const MobileMenuBar = () => {
  return (
    <nav className="z-50 flex items-center justify-between bg-gray-700 px-6 py-4 text-white lg:hidden">
      <Link href="/" className="flex items-center justify-center gap-3">
        <Image src="/images/logo.png" width={30} height={30} alt="Impact4Soil" priority />
        <span>Impact4Soil</span>
        <span className="rounded bg-gray-800 px-2 py-[3px] font-sans text-xs font-normal text-white">
          Beta
        </span>
      </Link>
      <MobileMenuButton />
    </nav>
  );
};

export default MobileMenuBar;

'use client';

import Image from 'next/image';
import Link from 'next/link';

import { handleSmoothScroll } from '@/lib/utils/ui';

import { modules } from '@/constants/modules';
const NavBar = () => {
  return (
    <div className="fixed z-20 flex h-[72px] w-full items-center justify-between gap-10 bg-white bg-opacity-80 px-10 backdrop-blur-[20px]">
      <Link href="/" className="flex min-w-fit items-center justify-start gap-2">
        <Image src="/images/logo.png" width={30} height={30} alt="Impact4Soil" />
        <div className="font-serif text-xl font-semibold text-gray-700">Impact4Soil</div>
      </Link>
      <div className="flex items-center justify-center gap-10 font-serif text-base text-gray-500">
        {modules.map((module) => {
          const { href, name } = module;
          return (
            <Link key={href} href={href} className="hover:text-gray-300">
              {name}
            </Link>
          );
        })}
        <a
          key="about-link"
          onClick={handleSmoothScroll}
          href="#about"
          className="hover:text-gray-300"
        >
          <div className="border-l border-gray-500 px-10">About the project</div>
        </a>
      </div>
    </div>
  );
};
export default NavBar;

'use client';

import Image from 'next/image';
import Link from 'next/link';

import { handleSmoothScroll } from '@/lib/utils/ui';

import { modules } from '@/constants/modules';

import MobileMenu from '@/components/mobile-menu';
import MobileMenuButton from '@/components/mobile-menu-button';
import { Dialog } from '@/components/ui/dialog';

const NavBar = () => (
  <div className="fixed z-20 flex h-[56px] w-full items-center justify-between gap-10 border-b border-gray-600 bg-gray-700 px-6 text-white lg:h-[60px] lg:border-none lg:bg-gray-800 lg:px-10">
    <a
      href="/#hero"
      onClick={handleSmoothScroll}
      className="flex min-w-fit items-center justify-start gap-2"
    >
      <Image src="/images/logo.png" width={30} height={30} alt="Impact4Soil" />
      <h1 className="font-serif text-base lg:text-xl lg:font-semibold">Impact4Soil</h1>
    </a>
    <Dialog>
      <MobileMenuButton />
      <MobileMenu />
    </Dialog>
    <nav className="hidden h-full items-center justify-center font-serif text-base lg:flex">
      {modules.map((module) => {
        const { href, name } = module;
        return 'external' in module && module.external ? (
          <a
            key={href}
            href={href}
            className="relative flex h-full items-center px-5 before:absolute before:left-1/2 before:top-0 before:block before:h-1 before:w-full before:-translate-x-1/2 before:scale-x-0 before:rounded-b-sm before:bg-yellow-500 before:transition-transform before:duration-500 hover:before:scale-x-100"
          >
            <div className="-mt-2 flex h-full items-center lg:max-xl:pt-2 lg:max-xl:text-center">
              {name}
            </div>
          </a>
        ) : (
          <Link
            key={href}
            href={href}
            className="relative flex h-full items-center px-5 before:absolute before:left-1/2 before:top-0 before:block before:h-1 before:w-full before:-translate-x-1/2 before:scale-x-0 before:rounded-b-sm before:bg-yellow-500 before:transition-transform before:duration-500 hover:before:scale-x-100"
          >
            <div className="-mt-2 flex h-full items-center lg:max-xl:pt-2 lg:max-xl:text-center">
              {name}
            </div>
          </Link>
        );
      })}
      <a
        key="about-link"
        onClick={handleSmoothScroll}
        href="/#about"
        className="relative flex h-full items-center before:absolute before:left-1/2 before:top-0 before:block before:h-1 before:w-full before:-translate-x-1/2 before:scale-x-0 before:rounded-b-sm before:bg-yellow-500 before:transition-transform before:duration-500 hover:before:scale-x-100"
      >
        <div className="-mt-2 border-l border-gray-600 px-5 lg:max-xl:pt-2 lg:max-xl:text-center">
          About the project
        </div>
      </a>
    </nav>
  </div>
);

export default NavBar;

'use client';

import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/classnames';
import { handleSmoothScroll } from '@/lib/utils/ui';

import { modules, moduleColors } from '@/constants/modules';
const NavBar = () => {
  return (
    <div className="fixed z-20 flex h-[72px] w-full items-center justify-between gap-10 border-b border-gray-100 bg-white bg-opacity-80 px-10 backdrop-blur-[20px]">
      <a
        href="/#hero"
        onClick={handleSmoothScroll}
        className="flex min-w-fit items-center justify-start gap-2"
      >
        <Image src="/images/logo.png" width={30} height={30} alt="Impact4Soil" />
        <h1 className="font-serif text-xl font-semibold text-gray-700">Impact4Soil</h1>
        <span className="rounded bg-gray-100 px-2 py-[3px] font-sans text-xs font-normal text-gray-700">
          Beta
        </span>
      </a>
      <nav className="flex h-full items-center justify-center gap-10 font-serif text-base text-gray-500">
        {modules.map((module) => {
          const { href, name, color } = module;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'box-border flex h-full items-center border-t-8 border-t-transparent',
                moduleColors[color].hoverBorder,
              )}
            >
              <div className="-mt-2 flex h-full items-center">{name}</div>
            </Link>
          );
        })}
        <a
          key="about-link"
          onClick={handleSmoothScroll}
          href="/#about"
          className="hover:text-gray-300"
        >
          <div className="border-l border-gray-500 px-10">About the project</div>
        </a>
      </nav>
    </div>
  );
};
export default NavBar;

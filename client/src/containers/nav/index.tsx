/* eslint-disable @next/next/no-img-element */
'use client';
import { PropsWithChildren } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Globe2, Users, Sheet, BarChart4 } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Module, modules } from '@/constants/modules';

// Module '"lucide-react"' has no exported member 'Tractor'
import Tractor from '@/styles/icons/tractor.svg';

type NavLinkProps = PropsWithChildren<
  Omit<Module, 'name'> & {
    active?: boolean;
  }
>;

const icons = {
  'geospatial-data': Globe2,
  'scientific-evidence': BarChart4,
  practices: Tractor,
  network: Users,
  datasets: Sheet,
};

const NavLink = ({ href, children, active, slug, ...rest }: NavLinkProps) => {
  const IconComponent = icons[slug as keyof typeof icons];
  return (
    <Link
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg py-2 text-xs leading-[18px] text-white transition-colors duration-200',
        {
          'bg-green-700': active,
          'hover:bg-gray-500': !active,
        },
      )}
      href={href}
      {...rest}
    >
      <IconComponent />
      <div className="text-center">{children}</div>
    </Link>
  );
};

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className="js-main-nav absolute left-0 z-50 hidden h-full w-[90px] lg:block">
      <div className="flex h-full w-full flex-col items-center justify-start gap-20 overflow-y-auto overflow-x-hidden bg-gray-800 py-6">
        <Link href="/" className="flex flex-col-reverse items-center justify-center gap-3">
          <span className="rounded bg-gray-700 px-2 py-[3px] font-sans text-xs font-normal text-white">
            Beta
          </span>
          <Image src="/images/logo.png" width={58} height={58} alt="Impact4Soil" priority />
          <span className="sr-only">Impact4Soil</span>
        </Link>
        <div className="mx-3 flex flex-col gap-3 py-px">
          {modules.map((module) => {
            const { href, color, name, slug } = module as Module;
            return (
              <NavLink
                key={href}
                slug={slug}
                href={href}
                color={color}
                active={pathname.startsWith(href)}
              >
                {name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

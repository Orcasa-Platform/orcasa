/* eslint-disable @next/next/no-img-element */
'use client';

import { PropsWithChildren } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/classnames';

import { Module, moduleColors, modules } from '@/constants/modules';

type NavLinkProps = PropsWithChildren<
  Omit<Module, 'name' | 'slug'> & {
    active?: boolean;
  }
>;

const NavLink = ({ href, children, color, active, ...rest }: NavLinkProps) => (
  <Link
    className={cn(
      'flex h-[68px] cursor-pointer items-center justify-start border-l-8 py-4 pl-4 pr-4 font-serif text-sm leading-tight transition-colors duration-200 hover:bg-white hover:text-slate-700',
      moduleColors[color].border,
      {
        'bg-white': active,
        'text-gray-700': active,
        'bg-gray-700': !active,
        'text-white': !active,
      },
    )}
    href={href}
    {...rest}
  >
    {children}
  </Link>
);

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className="js-main-nav absolute left-0 z-50 hidden h-full w-[117px] lg:block">
      <div className="flex h-full w-full flex-col items-center justify-start gap-20 overflow-y-auto overflow-x-hidden bg-gray-700 py-6">
        <Link href="/" className="flex flex-col-reverse items-center justify-center gap-3">
          <span className="rounded bg-gray-800 px-2 py-[3px] font-sans text-xs font-normal text-white">
            Beta
          </span>
          <Image src="/images/logo.png" width={58} height={58} alt="Impact4Soil" priority />
          <span className="sr-only">Impact4Soil</span>
        </Link>
        <div className="flex flex-col gap-px bg-gray-600 py-px">
          {modules.map((module) => {
            const { href, color, name } = module as Module;
            return (
              <NavLink key={href} href={href} color={color} active={pathname?.startsWith(href)}>
                {name}
              </NavLink>
            );
          })}
        </div>
        <div className="mt-auto flex flex-col items-center gap-y-4">
          <span className="text-xs text-gray-400">A project by:</span>
          <a href="https://irc-orcasa.eu/" target="_blank" rel="noreferrer">
            <Image src="/images/orcasa-logo-white.png" width={85} height={26} alt="ORCaSa" />
            <span className="sr-only text-xs text-gray-400">ORCaSa</span>
          </a>
        </div>
      </div>
    </div>
  );
}

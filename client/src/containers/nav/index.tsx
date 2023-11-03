/* eslint-disable @next/next/no-img-element */
'use client';
import { PropsWithChildren } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/classnames';

import Logo from '/public/images/logo.svg';

import { Module, moduleColors, modules } from '@/constants/modules';

type NavLinkProps = PropsWithChildren<Omit<Module, 'name'> & { active?: boolean }>;

const NavLink = ({ href, children, color, active }: NavLinkProps) => (
  <Link
    className={cn(
      'flex h-[68px] cursor-pointer items-center justify-start border-l-8 py-4 pl-4 pr-4 font-serif text-sm leading-tight transition-colors duration-200 hover:bg-white hover:text-slate-700',
      moduleColors[color].border,
      {
        'bg-white': active,
        'text-slate-700': active,
        'bg-slate-700': !active,
        'text-white': !active,
      },
    )}
    href={href}
  >
    {children}
  </Link>
);

export default function Nav() {
  const pathname = usePathname();
  return (
    <div className="js-main-nav absolute left-0 z-50 h-full w-[117px]">
      <div className="flex h-full w-full flex-col items-center justify-start gap-20 overflow-y-auto overflow-x-hidden bg-slate-700 py-6">
        <Link href="/">
          <Logo className="h-[68px] w-[69px]" />
          <span className="sr-only">ORCaSa</span>
        </Link>
        <div className="flex flex-col gap-px bg-slate-600 py-px">
          {modules.map((module) => {
            const { href, color, name } = module;
            return (
              <NavLink key={href} href={href} color={color} active={pathname === href}>
                {name}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

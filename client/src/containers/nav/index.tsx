/* eslint-disable @next/next/no-img-element */
'use client';
import { PropsWithChildren } from 'react';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Globe2, Users, Sheet, BarChart4 } from 'lucide-react';

import Tractor from '/public/images/tractor.svg';

import { cn } from '@/lib/classnames';

import { Module, modules } from '@/constants/modules';

const ScientificEvidenceBanner = dynamic(() => import('@/components/scientific-evidence-banner'), {
  ssr: false,
});

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
        'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg py-2 text-xs leading-[18px] text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800',
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
  const isPractices = pathname?.startsWith('/practices');
  return (
    <div className="js-main-nav absolute left-0 z-50 hidden h-full w-[90px] lg:block">
      <div className="flex h-full w-full flex-col items-center justify-start gap-20 overflow-y-auto overflow-x-hidden bg-gray-800 py-6">
        <Link href="/">
          <Image
            src="/images/logo.png"
            width={48}
            height={48}
            alt="Impact4Soil"
            priority
            className="rounded-lg border border-gray-600 p-1"
          />
          <span className="sr-only">Impact4Soil</span>
        </Link>
        {isPractices && <ScientificEvidenceBanner />}
        <div className="mx-3 flex flex-col gap-3 py-px">
          {modules.map((module) => {
            const { href, name, slug } = module as Module;
            return (
              <NavLink key={href} slug={slug} href={href} active={pathname?.startsWith(href)}>
                {name}
              </NavLink>
            );
          })}
        </div>
        <Link href="/" className="mt-auto font-serif text-xs font-semibold text-white">
          Impact4Soil
        </Link>
      </div>
    </div>
  );
}

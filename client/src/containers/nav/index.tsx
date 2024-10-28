/* eslint-disable @next/next/no-img-element */
'use client';
import { ForwardedRef, forwardRef, PropsWithChildren } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Globe2, Users, Sheet, BarChart4 } from 'lucide-react';

import Tractor from '/public/images/tractor.svg';

import env from '@/env.mjs';

import ScientificEvidenceNavTooltip from '@/components/scientific-evidence-nav-tooltip';
import SurveyNavDialog from '@/components/survey-nav-dialog';
import { Button } from '@/components/ui/button';

import { cn } from '@/lib/classnames';

import { Module, modules } from '@/constants/modules';

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

const NavLink = (
  { href, children, active, slug, ...rest }: NavLinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) => {
  const IconComponent = icons[slug as keyof typeof icons];
  return (
    <Link
      ref={ref}
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

const NavLinkWithRef = forwardRef(NavLink);

export default function Nav() {
  const pathname = usePathname();
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
            className="mx-auto rounded-lg border border-gray-600 p-1"
          />
          <span className="text-xs font-semibold text-white">Impact4Soil</span>
        </Link>

        <div className="mx-3 flex flex-col gap-3 py-px">
          {modules.map((module) => {
            const { href, name, slug } = module as Module;
            return (
              <ScientificEvidenceNavTooltip key={href} navSlug={slug}>
                <NavLinkWithRef slug={slug} href={href} active={pathname?.startsWith(href)}>
                  {name}
                </NavLinkWithRef>
              </ScientificEvidenceNavTooltip>
            );
          })}
        </div>
        {!!env.NEXT_PUBLIC_SURVEY_URL && (
          <SurveyNavDialog>
            <Button type="button" variant="outline-dark" size="xs" className="mt-auto text-white">
              Survey
            </Button>
          </SurveyNavDialog>
        )}
      </div>
    </div>
  );
}

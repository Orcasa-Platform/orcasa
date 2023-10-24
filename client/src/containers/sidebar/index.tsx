'use client';

import { useEffect, useMemo } from 'react';

import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useSidebarOpen } from '@/store';

import { Section } from '@/types/app';

import { useTheme } from '@/hooks/ui/theme';

import { Button } from '@/components/ui/button';
type OpenerVariant = 'opener-dark' | 'opener-light';

export const useScrollSidebarToTop = () => {
  useEffect(() => {
    // NOTE: a ref would be preferable but unfortunately means that the whole file tree needs to be
    // changed. This hook won't be necessary anymore when Next.js fixes the issues related to the
    // automatic scroll restoration when navigating.
    const sidebarScrollContainer = document.querySelector('.js-sidebar-scroll-container');
    if (sidebarScrollContainer) {
      sidebarScrollContainer.scrollTo({ top: 0 });
    }
  }, []);
};

export default function Sidebar({
  children,
  section,
}: {
  children: React.ReactNode;
  section: Section;
}) {
  const [open, setOpen] = useSidebarOpen();
  const variant: OpenerVariant = useTheme('opener');

  const widthClassName = useMemo(() => {
    const sectionMaxWidth: Partial<Record<Section, string>> = {
      'geospatial-data': 'w-[min(35%,_490px)]',
      practices: 'w-[min(45%,_820px)]',
      network: 'w-[min(45%,_860px)]',
    };
    return sectionMaxWidth[section] ?? '';
  }, [section]);

  return (
    <div
      className={cn({
        'js-sidebar absolute left-[117px] top-0 flex h-full w-full flex-col bg-white shadow-lg transition-transform duration-500':
          true,
        [widthClassName]: true,
        'translate-x-0': open,
        '-translate-x-full': !open,
      })}
    >
      <div className="absolute left-full top-0 z-10">
        <Button
          variant={variant}
          size="icon"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ChevronLeft
            className={cn({
              'h-6 w-6 transition-transform': true,
              'rotate-180': !open,
            })}
          />
        </Button>
      </div>

      <div className="js-sidebar-scroll-container flex grow flex-col overflow-y-auto">
        <div className="space-y-5 p-5 text-slate-700">{children}</div>
      </div>
    </div>
  );
}

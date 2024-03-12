/* eslint-disable @next/next/no-img-element */
'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';

import { ChevronLeft } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useSidebarOpen } from '@/store';

import { Section } from '@/types/app';

import { useTheme } from '@/hooks/ui/theme';

import { Button } from '@/components/ui/button';

type OpenerVariant = 'opener-dark' | 'opener-light';

/**
 * Get and (immediately) set the scroll position of the sidebar
 */
export const useSidebarScrollHelpers = (): [() => number, (scrollTop: number) => void] => {
  const scrollContainer = useRef<HTMLDivElement | null>(null);

  const getScrollTop = useCallback(() => {
    if (scrollContainer.current) {
      return scrollContainer.current.scrollTop;
    }

    return 0;
  }, [scrollContainer]);

  const setScrollTop = useCallback(
    (scrollTop: number) => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollTo({ top: scrollTop });
      }
    },
    [scrollContainer],
  );

  useEffect(() => {
    const element = document.querySelector<HTMLDivElement>('.js-sidebar-scroll-container');
    if (element) {
      scrollContainer.current = element;
    }
  }, [scrollContainer]);

  return [getScrollTop, setScrollTop];
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
        'js-sidebar absolute bottom-2 left-[90px] top-2 z-20 hidden w-full flex-col transition-transform duration-500 lg:flex':
          true,
        [widthClassName]: true,
        'translate-x-0': open,
        '-translate-x-full': !open,
      })}
    >
      <div className="absolute left-full top-4 z-10">
        <Button
          variant={variant}
          size="icon"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ChevronLeft
            className={cn({
              'h-5 w-5 transition-transform': true,
              'rotate-180': !open,
            })}
          />
        </Button>
      </div>
      <div className="js-sidebar-scroll-container flex grow flex-col overflow-y-auto rounded-lg rounded-r-none border-r border-gray-500 bg-gray-700">
        <div
          className="space-y-5 bg-contain bg-no-repeat px-12 py-10 text-white"
          style={{
            backgroundImage: `url('/images/sidebar-background.svg')`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

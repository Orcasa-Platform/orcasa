'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import Filter from '/public/images/filter.svg';

import { usePreviousImmediate } from 'rooks';

import { cn } from '@/lib/classnames';

import { useSidebarScroll } from '@/store';

import {
  usePracticesFilterSidebarOpen,
  usePracticesFilters,
  useFiltersCount,
} from '@/store/practices';

import { useGetPages } from '@/types/generated/page';

import { usePractices, usePracticesCount } from '@/hooks/practices';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import TutorialButton from '@/components/map/tutorial-button';
import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

import PracticeList from './practice-list';

export default function PracticesModule() {
  const pages = useGetPages({ filters: { slug: 'practices' } });

  const data = pages?.data?.data?.[0];
  const { attributes: { intro = undefined } = {} } = data || {};

  const [filters, setFilters] = usePracticesFilters();
  const previousFilters = usePreviousImmediate(filters);

  const practices = usePractices({ filters });
  const practicesCount = usePracticesCount(filters);
  const [filterSidebarOpen, setFilterSidebarOpen] = usePracticesFilterSidebarOpen();
  const previousFilterSidebarOpen = usePreviousImmediate(filterSidebarOpen);

  const [getSidebarScroll, setSidebarScroll] = useSidebarScrollHelpers();
  const [savedSidebarScroll, setSavedSidebarScroll] = useSidebarScroll();

  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);

  // We store the sidebar's scroll position when navigating away from the list view. `useEffect`
  // can't be used because it would be executed after repainting i.e. after navigating.
  useLayoutEffect(() => {
    return () => {
      setSavedSidebarScroll(getSidebarScroll());
    };
  }, [getSidebarScroll, setSavedSidebarScroll]);

  // When navigating to the list view, we restore the sidebar's scroll position
  useEffect(() => {
    if (savedSidebarScroll !== 0) {
      setSidebarScroll(savedSidebarScroll);
    }
  }, [savedSidebarScroll, setSidebarScroll]);

  // Focus back on the filters button when the filters sidebar is closed
  useEffect(() => {
    if (previousFilterSidebarOpen && !filterSidebarOpen && filtersButtonRef.current) {
      filtersButtonRef.current.focus();
    }
  }, [filterSidebarOpen, previousFilterSidebarOpen]);

  // When the user adds or removes filters, we scroll to the top of the list
  useEffect(() => {
    if (previousFilters && previousFilters !== filters) {
      setSidebarScroll(0);
    }
  }, [filters, previousFilters, setSidebarScroll]);

  // The keywords search is not counted because it's shown in the main sidebar
  const filtersCount = useFiltersCount(filters, ['search']);

  return (
    <div className="m-4 space-y-4 pt-4 lg:m-0 lg:space-y-10">
      <h1 className="font-serif leading-7">
        <div className="font-serif text-2xl text-white lg:hidden">Practices</div>
        <div className="hidden lg:block">
          {intro && <MarkdownRenderer variant="bold" content={intro} />}
        </div>
      </h1>
      <TutorialButton href="https://vimeo.com/1060783048" />
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between gap-x-4 text-white">
          <Search
            containerClassName="basis-full"
            defaultValue={filters.search}
            placeholder="Search practice"
            onChange={(keywords) => setFilters({ ...filters, search: keywords })}
          />
          <Button
            ref={filtersButtonRef}
            type="button"
            variant={filterSidebarOpen ? 'filters' : 'primary'}
            className="group hidden shrink-0 gap-2 transition-colors duration-500 focus-visible:ring-offset-gray-700 lg:flex"
            aria-pressed={filterSidebarOpen}
            onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
          >
            <Filter className="h-6 w-6" />
            Filters
            {filtersCount > 0 && (
              <div
                className={cn(
                  'flex h-[22px] w-[22px] items-center justify-center rounded-full p-1 text-2xs',
                  {
                    'bg-yellow-700': filterSidebarOpen,
                    'bg-green-900': !filterSidebarOpen,
                  },
                )}
              >
                {filtersCount}
              </div>
            )}
          </Button>
        </div>
      </div>
      <div className="text-sm text-gray-200 lg:text-xs">
        {`Showing ${practicesCount} practice${practicesCount === 1 ? '' : 's'}.`}
      </div>
      <div className="!mt-6">
        <PracticeList {...practices} />
      </div>
    </div>
  );
}

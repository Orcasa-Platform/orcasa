'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import { X } from 'lucide-react';
import Filter from 'public/images/filter.svg';
import { usePreviousImmediate } from 'rooks';

import { useSidebarScroll } from '@/store';

import {
  PracticesDropdownFilters,
  usePracticesFilterSidebarOpen,
  usePracticesFilters,
} from '@/store/practices';

import { useGetPages } from '@/types/generated/page';

import { usePractices, usePracticesActiveFilters, usePracticesCount } from '@/hooks/practices';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import MarkdownRenderer from '@/components/home/markdown-renderer';
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
  const activeFilters = usePracticesActiveFilters();
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

  return (
    <div className="m-4 space-y-4 pt-4 lg:m-0 lg:space-y-10">
      <h1 className="font-serif leading-7">
        <div className="font-serif text-2xl text-white lg:hidden">Practices</div>
        <div className="hidden lg:block">
          {intro && <MarkdownRenderer variant="bold" content={intro} />}
        </div>
      </h1>
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
            className="group hidden shrink-0 transition-colors duration-500 focus-visible:ring-offset-gray-700 lg:flex"
            aria-pressed={filterSidebarOpen}
            onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
          >
            <Filter className="mr-2 h-6 w-6" />
            Filters
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeFilters.map(({ filter, label, value }) => (
            <Button
              key={[filter, value].join('-')}
              type="button"
              variant="filter-tag"
              size="xs"
              title={label}
              onClick={() => {
                const filterValue = filters?.[filter as keyof PracticesDropdownFilters];
                setFilters({
                  ...filters,
                  [filter]: Array.isArray(filterValue)
                    ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      filterValue?.filter((filterValue) => filterValue !== value)
                    : undefined,
                });
              }}
            >
              <span className="sr-only">Remove filter:&nbsp;</span>
              <span className="line-clamp-1">{label}</span>
              <X className="ml-1 h-4 w-4 shrink-0" />
            </Button>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-200 lg:text-xs">
        {`Showing ${practicesCount} practice${practicesCount > 1 ? 's' : ''}.`}
      </div>
      <div className="!mt-6">
        <PracticeList {...practices} />
      </div>
    </div>
  );
}

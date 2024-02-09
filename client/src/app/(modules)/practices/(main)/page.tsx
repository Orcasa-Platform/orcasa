'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import { Filter } from 'lucide-react';
import { usePreviousImmediate } from 'rooks';

import { useSidebarScroll } from '@/store';

import {
  useFiltersCount,
  usePracticesFilterSidebarOpen,
  usePracticesFilters,
} from '@/store/practices';

import { useGetPages } from '@/types/generated/page';

import { usePractices } from '@/hooks/practices';

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
  // The keywords search is not counted because it's shown in the main sidebar
  const filtersCount = useFiltersCount(filters, ['search']);

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
    <div className="space-y-10">
      <h1 className="border-l-4 border-brown-500 pl-5 font-serif text-lg leading-7">
        {intro && (
          <MarkdownRenderer variant="page-intro" textClass="text-brown-500" content={intro} />
        )}
      </h1>
      <div className="flex justify-between gap-x-4">
        <Search
          containerClassName="basis-full"
          defaultValue={filters.search}
          onChange={(keywords) => setFilters({ ...filters, search: keywords })}
        />
        <Button
          ref={filtersButtonRef}
          type="button"
          variant="primary"
          className="group shrink-0 bg-brown-500 text-base hover:bg-brown-900"
          aria-pressed={filterSidebarOpen}
          onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
        >
          <Filter className="mr-4 h-6 w-6" />
          Filters
          {filtersCount > 0 && (
            <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-brown-800 font-semibold transition group-hover:bg-gray-900">
              {filtersCount}
            </span>
          )}
        </Button>
      </div>
      <PracticeList {...practices} />
    </div>
  );
}

'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import { Filter, Users2 } from 'lucide-react';
import { usePreviousImmediate } from 'rooks';

import { useSidebarScroll } from '@/store';

import { useFiltersCount, useNetworkFilters, useNetworkFilterSidebarOpen } from '@/store/network';

import { useGetPages } from '@/types/generated/page';

import { useNetworks, useNetworksCount, useRegionsCount } from '@/hooks/networks';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import NewButtons from '@/components/new-buttons';
import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

import NetworkList from './network-list';

export default function NetworkModule() {
  const [filters, setFilters] = useNetworkFilters();
  const previousFilters = usePreviousImmediate(filters);

  const pages = useGetPages({ filters: { slug: 'network' } });
  const data = pages?.data?.data?.[0];
  const { attributes: { intro = undefined } = {} } = data || {};

  const regionsCount = useRegionsCount();

  const networks = useNetworks({ filters, regionsCount });
  const networksCount = useNetworksCount(filters);

  // The keywords search is not counted because it's shown in the main sidebar
  const filtersCount = useFiltersCount(filters, ['search']);

  const [filterSidebarOpen, setFilterSidebarOpen] = useNetworkFilterSidebarOpen();
  const previousFilterSidebarOpen = usePreviousImmediate(filterSidebarOpen);

  const [getSidebarScroll, setSidebarScroll] = useSidebarScrollHelpers();
  const [savedSidebarScroll, setSavedSidebarScroll] = useSidebarScroll();

  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);

  const loadOrganizations = !filters.type?.length || filters.type.includes('organization');
  const loadInitiatives = !filters.type?.length || filters.type.includes('project');

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

  const renderFormButtons = (
    <div className="fixed bottom-0 left-0 flex w-full flex-wrap items-center justify-between border-r border-gray-200 bg-white px-4 py-6 lg:flex-nowrap">
      <div className="flex items-center">
        <Users2 className="mb-1 mr-2 h-7 w-10 min-w-fit whitespace-nowrap text-blue-400" />
        <div className="flex-shrink font-serif text-base font-semibold">
          Help us building the soil-
          <wbr />
          carbon network
        </div>
      </div>
      <NewButtons className="mt-2 min-w-fit space-x-4 lg:ml-2 lg:mt-0" />
    </div>
  );

  return (
    <div className="space-y-10">
      <h1 className="max-w-[372px] border-l-4 border-blue-500 pl-5 font-serif text-lg leading-7">
        {intro && <MarkdownRenderer variant="bold" textClass="text-blue-500" content={intro} />}
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
          className="group shrink-0 bg-blue-500 text-base hover:bg-blue-900"
          aria-pressed={filterSidebarOpen}
          onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
        >
          <Filter className="mr-4 h-6 w-6" />
          Filters
          {filtersCount > 0 && (
            <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-blue-800 font-semibold transition group-hover:bg-gray-900">
              {filtersCount}
            </span>
          )}
        </Button>
      </div>
      <div className="border-t border-dashed border-t-gray-300 pt-6 text-sm text-gray-500">
        {loadOrganizations &&
          loadInitiatives &&
          `Showing ${networksCount.organisation} organisation${
            networksCount.organisation > 1 ? 's' : ''
          } and ${networksCount.project} initiative${networksCount.project > 1 ? 's' : ''}.`}
        {loadOrganizations &&
          !loadInitiatives &&
          `Showing ${networksCount.organisation} organisation${
            networksCount.organisation > 1 ? 's' : ''
          }.`}
        {!loadOrganizations &&
          loadInitiatives &&
          `Showing ${networksCount.project} initiative${networksCount.project > 1 ? 's' : ''}.`}
      </div>
      <div className="!mt-6">
        <NetworkList {...networks} />
      </div>
      {renderFormButtons}
    </div>
  );
}

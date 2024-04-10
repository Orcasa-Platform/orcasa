'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import { X } from 'lucide-react';
import Filter from 'public/images/filter.svg';
import { usePreviousImmediate } from 'rooks';

import { useSidebarScroll } from '@/store';

import {
  NetworkFilters,
  NetworkGeneralFilters,
  useNetworkFilters,
  useNetworkFilterSidebarOpen,
} from '@/store/network';

import { useGetPages } from '@/types/generated/page';

import {
  useNetworkActiveFilters,
  useNetworks,
  useNetworksCount,
  useRegionsCount,
} from '@/hooks/networks';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import MarkdownRenderer from '@/components/home/markdown-renderer';
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

  const activeFilters = useNetworkActiveFilters();

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

  return (
    <div className="space-y-4 lg:space-y-8">
      <h1 className="font-serif leading-7">
        <div className="font-serif text-2xl text-white lg:hidden">Network</div>
        <div className="hidden lg:block">
          {intro && <MarkdownRenderer variant="bold" content={intro} />}
        </div>
      </h1>
      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between gap-x-4">
          <Search
            containerClassName="basis-full"
            defaultValue={filters.search}
            onChange={(keywords) => setFilters({ ...filters, search: keywords })}
          />
          <Button
            ref={filtersButtonRef}
            type="button"
            variant={filterSidebarOpen ? 'filters' : 'primary'}
            className="group hidden shrink-0 transition-colors duration-500 lg:flex"
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
              onClick={() =>
                setFilters({
                  ...filters,
                  [filter]: filters?.[
                    filter as keyof Omit<NetworkFilters, keyof NetworkGeneralFilters>
                  ]?.filter((filterValue) => filterValue !== value),
                })
              }
            >
              <span className="sr-only">Remove filter:&nbsp;</span>
              <span className="line-clamp-1">{label}</span>
              <X className="ml-1 h-4 w-4 shrink-0" />
            </Button>
          ))}
        </div>
      </div>
      <div className="text-sm text-gray-200 lg:text-xs">
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
    </div>
  );
}

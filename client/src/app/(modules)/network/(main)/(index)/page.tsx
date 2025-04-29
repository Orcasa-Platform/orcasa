'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import Filter from '/public/images/filter.svg';

import { usePreviousImmediate } from 'rooks';

import { cn } from '@/lib/classnames';

import { useSidebarScroll } from '@/store';

import { useNetworkFilters, useNetworkFilterSidebarOpen, useFiltersCount } from '@/store/network';

import { useGetPages } from '@/types/generated/page';

import { useNetworks, useNetworksCount, useRegionsCount } from '@/hooks/networks';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import InfoButton from '@/components/map/info-button';
import TutorialButton from '@/components/map/tutorial-button';
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

  const [filterSidebarOpen, setFilterSidebarOpen] = useNetworkFilterSidebarOpen();
  const previousFilterSidebarOpen = usePreviousImmediate(filterSidebarOpen);

  const [getSidebarScroll, setSidebarScroll] = useSidebarScrollHelpers();
  const [savedSidebarScroll, setSavedSidebarScroll] = useSidebarScroll();

  const filtersButtonRef = useRef<HTMLButtonElement | null>(null);

  const loadOrganizations = !filters.type?.length || filters.type.includes('organization');
  const loadInitiatives = !filters.type?.length || filters.type.includes('project');

  // The keywords search is not counted because it's shown in the main sidebar
  const filtersCount = useFiltersCount(filters, ['search']);

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
      <h1 className="mb-2 font-serif leading-7">
        <div className="font-serif text-2xl text-white lg:hidden">Network</div>
        <div className="hidden lg:block">
          {intro && (
            <MarkdownRenderer
              variant="bold"
              content={intro}
              className="inline"
              markupClassName="inline"
            />
          )}
          <InfoButton>
            This module allows users to explore ongoing projects to discover potential synergies, to
            identify research organisations that can provide valuable data, up-to-date methods, and
            innovative practices, to identify potential funders for their future collaborative
            opportunities, to add their own organization or initiative by filling a form at the
            bottom of the page. Organizations and initiatives are added or updated as soon as a user
            suggests them.
          </InfoButton>
        </div>
      </h1>
      <TutorialButton href="https://vimeo.com/1060782630" />
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
            className="group hidden shrink-0 gap-2 transition-colors duration-500 lg:flex"
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
        {loadOrganizations &&
          loadInitiatives &&
          `Showing ${networksCount.organisation} organisation${
            networksCount.organisation === 1 ? '' : 's'
          } and ${networksCount.project} initiative${networksCount.project === 1 ? '' : 's'}.`}
        {loadOrganizations &&
          !loadInitiatives &&
          `Showing ${networksCount.organisation} organisation${
            networksCount.organisation === 1 ? '' : 's'
          }.`}
        {!loadOrganizations &&
          loadInitiatives &&
          `Showing ${networksCount.project} initiative${networksCount.project === 1 ? '' : 's'}.`}
      </div>
      <div className="!mt-6">
        <NetworkList {...networks} />
      </div>
    </div>
  );
}

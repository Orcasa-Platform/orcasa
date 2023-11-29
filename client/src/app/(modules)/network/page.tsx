'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';

import {
  Filter,
  //  Plus
} from 'lucide-react';
import { usePreviousImmediate } from 'rooks';

import { useSidebarScroll } from '@/store';

import { useFiltersCount, useNetworkFilterSidebarOpen, useNetworkFilters } from '@/store/network';

import { useNetworks } from '@/hooks/networks';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

import NetworkList from './network-list';

// const AddButton = ({ text }: { text: string }) => (
//   <Button
//     onClick={() => {
//       // TODO - add elements
//     }}
//   >
//     <Plus className="w-6 h-6 mr-2" />
//     <div className="text-base">{text}</div>
//   </Button>
// );

export default function NetworkModule() {
  const [filters, setFilters] = useNetworkFilters();
  const previousFilters = usePreviousImmediate(filters);

  const networks = useNetworks({ filters });
  // The keywords search is not counted because it's shown in the main sidebar
  const filtersCount = useFiltersCount(filters, ['search']);

  const [filterSidebarOpen, setFilterSidebarOpen] = useNetworkFilterSidebarOpen();
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
      <h1 className="max-w-[372px] border-l-4 border-blue-500 pl-5 font-serif text-lg leading-7">
        Discover <span className="font-semibold text-blue-500">who does what</span> on soil carbon.
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
      <NetworkList {...networks} />
      {/* TODO: Recover form buttons */}
      {/* <div className="flex items-center justify-between">
        <div className="font-serif text-xl font-semibold leading-[30px]">
          Help us building the soil-carbon network
        </div>
        <div className="space-x-4">
          <AddButton text="Add organisation" />
          <AddButton text="Add project" />
        </div>
      </div> */}
    </div>
  );
}

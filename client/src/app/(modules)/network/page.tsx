'use client';

import { useEffect, useLayoutEffect } from 'react';

import { capitalize } from 'lodash';
import { Filter, Plus } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useSidebarScroll } from '@/store';

import { useNetworks } from '@/hooks/networks';

import { useSidebarScrollHelpers } from '@/containers/sidebar';

import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

import NetworkList from './network-list';

const AddButton = ({ text }: { text: string }) => (
  <Button
    onClick={() => {
      // TODO - add elements
    }}
  >
    <Plus className="mr-2 h-6 w-6" />
    <div className="text-base">{text}</div>
  </Button>
);
const FilterButton = ({ text }: { text: string }) => (
  <Button
    onClick={() => {
      // TODO - add elements
    }}
  >
    <Filter className="mr-2 h-6 w-6" />
    <div className="text-base">{text}</div>
  </Button>
);
const CategoryButton = ({ category, count }: { category: string; count: number }) => (
  <Button
    className={cn('gap-1 text-base font-semibold', {
      'bg-sky-700  hover:bg-sky-700/80': category === 'projects',
      'bg-blue-400 hover:bg-blue-400/80': category === 'organisations',
    })}
    variant="button-switch"
    onClick={() => {
      // TODO - add elements
    }}
  >
    <span>{capitalize(category)}</span>
    <span className="font-normal">({count})</span>
  </Button>
);

export default function NetworkModule() {
  const networks = useNetworks({ page: 1 });

  const [getSidebarScroll, setSidebarScroll] = useSidebarScrollHelpers();
  const [savedSidebarScroll, setSavedSidebarScroll] = useSidebarScroll();

  // We store the sidebar's scroll position when navigating away from the list view. `useEffect`
  // can't be used because it would be executed after repainting i.e. after navigating.
  useLayoutEffect(() => {
    return () => {
      setSavedSidebarScroll(getSidebarScroll());
    };
  }, [getSidebarScroll, setSavedSidebarScroll]);

  // When navigating to the list view, we restore the sidabar's scroll position
  useEffect(() => {
    if (savedSidebarScroll !== 0) {
      setSidebarScroll(savedSidebarScroll);
    }
  }, [savedSidebarScroll, setSidebarScroll]);

  return (
    <>
      <h1 className="max-w-[372px] border-l-4 border-blue-500 pl-5 font-serif text-lg leading-7">
        Discover <span className="font-semibold text-blue-500">who does what</span> on soils carbon.
      </h1>
      <Search
        onChange={() => {
          // TODO - search
        }}
      />
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <CategoryButton category="organisations" count={networks.count.organizations} />
          <CategoryButton category="projects" count={networks.count.projects} />
        </div>
        <FilterButton text="More filters" />
      </div>
      <NetworkList {...networks} />
      <div className="flex items-center justify-between">
        <div className="font-serif text-xl font-semibold leading-[30px]">
          Help us building the soil-carbon network
        </div>
        <div className="space-x-4">
          <AddButton text="Add organisation" />
          <AddButton text="Add project" />
        </div>
      </div>
    </>
  );
}

'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { usePracticesFilterSidebarOpen, usePracticesFilters } from '@/store/practices';

import { usePracticesFiltersOptions } from '@/hooks/practices';

import { Button } from '@/components/ui/button';
import { MultiCombobox } from '@/components/ui/multi-combobox';

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = usePracticesFilterSidebarOpen();
  const practicesFiltersOptions = usePracticesFiltersOptions();
  const [filters, setFilters] = usePracticesFilters();
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Move the focus to the close button when the sidebar is opened
  useEffect(() => {
    if (filterSidebarOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [filterSidebarOpen]);

  // When the user reopens the sidebar, make sure it's scrolled to the top
  useEffect(() => {
    if (filterSidebarOpen && scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({ top: 0 });
    }
  }, [filterSidebarOpen, scrollableContainerRef]);

  return (
    <div
      // `inert` is not yet supported by React so that's why it is spread below:
      // https://github.com/facebook/react/issues/17157
      {...(!filterSidebarOpen ? { inert: '' } : {})}
      className={cn('absolute left-full top-0 -z-10 h-full w-[380px] bg-white duration-500', {
        '-translate-x-full': !filterSidebarOpen,
        'translate-x-0': filterSidebarOpen,
      })}
    >
      <div
        ref={scrollableContainerRef}
        className="flex h-full flex-col gap-y-10 overflow-y-auto p-12"
      >
        <Button
          ref={closeButtonRef}
          type="button"
          variant="primary"
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => setFilterSidebarOpen(false)}
        >
          <span className="sr-only">Close</span>
          <X className="h-6 w-6" />
        </Button>
        <h1 className="font-serif text-3.8xl">Filters</h1>
        <div className="flex flex-col gap-y-10">
          <fieldset className="relative">
            <Button
              type="button"
              variant="vanilla"
              size="auto"
              className="absolute bottom-full right-0 -translate-y-4 text-base font-semibold text-blue-500 hover:text-blue-800 disabled:text-gray-300 disabled:opacity-100"
              onClick={() =>
                setFilters({
                  ...filters,
                  country: [],
                })
              }
            >
              Reset all
            </Button>
            <div className="space-y-4">
              <MultiCombobox
                name="Country"
                variant="network-organization"
                value={filters.country ?? []}
                options={practicesFiltersOptions.country}
                onChange={(value) => setFilters({ ...filters, country: value as number[] })}
              />
              <MultiCombobox
                name="Land use types"
                variant="network-organization"
                value={filters.landUseType ?? []}
                options={practicesFiltersOptions.landUseType}
                onChange={(value) => setFilters({ ...filters, landUseType: value as string[] })}
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

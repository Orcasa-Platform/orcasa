'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import {
  useFiltersCount,
  useNetworkFilterSidebarOpen,
  useNetworkFilters,
  useNetworkOrganizationFilters,
  useNetworkProjectFilters,
} from '@/store/network';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = useNetworkFilterSidebarOpen();
  const [filters, setFilters] = useNetworkFilters();
  const [organizationFilters] = useNetworkOrganizationFilters();
  const [projectFilters] = useNetworkProjectFilters();
  const organizationFiltersCount = useFiltersCount(organizationFilters);
  const projectFiltersCount = useFiltersCount(projectFilters);

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Move the focus to the close button when the sidebar is opened
  useEffect(() => {
    if (filterSidebarOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [filterSidebarOpen]);

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
      <div className="flex h-full flex-col gap-y-10 p-12">
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
          <fieldset className="flex flex-col gap-y-4">
            <legend className="mb-4 font-semibold">Type</legend>
            <div className="flex items-center gap-x-2">
              <Checkbox
                id="filter-organization"
                checked={filters.type?.includes('organization') ?? false}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    type: checked
                      ? [...(filters.type ?? []), 'organization']
                      : (filters.type ?? []).filter((filter) => filter !== 'organization'),
                  })
                }
              />
              <Label htmlFor="filter-organization">Organizations</Label>
            </div>
            <div className="flex items-center gap-x-2">
              <Checkbox
                id="filter-project"
                checked={filters.type?.includes('project') ?? false}
                onCheckedChange={(checked) =>
                  setFilters({
                    ...filters,
                    type: checked
                      ? [...(filters.type ?? []), 'project']
                      : (filters.type ?? []).filter((filter) => filter !== 'project'),
                  })
                }
              />
              <Label htmlFor="filter-project">Projects</Label>
            </div>
          </fieldset>
          <fieldset className="relative">
            <legend className="mb-4 font-semibold">Organisation</legend>
            <Button
              type="button"
              variant="vanilla"
              size="auto"
              className="absolute bottom-full right-0 -translate-y-4 text-base font-semibold text-blue-500 hover:text-blue-800 disabled:text-gray-300 disabled:opacity-100"
              disabled={organizationFiltersCount === 0}
              onClick={() =>
                setFilters({
                  ...filters,
                  organizationType: null,
                  mainThematic: null,
                  country: null,
                })
              }
            >
              Reset all
            </Button>
          </fieldset>
          <fieldset className="relative">
            <legend className="mb-4 font-semibold">Project</legend>
            <Button
              type="button"
              variant="vanilla"
              size="auto"
              className="absolute bottom-full right-0 -translate-y-4 text-base font-semibold text-peach-700 hover:text-peach-900 disabled:text-gray-300 disabled:opacity-100"
              disabled={projectFiltersCount === 0}
              onClick={() =>
                setFilters({
                  ...filters,
                  projectType: null,
                  status: null,
                  coordinationCountry: null,
                  interventionRegion: null,
                  interventionCountry: null,
                  interventionArea: null,
                })
              }
            >
              Reset all
            </Button>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

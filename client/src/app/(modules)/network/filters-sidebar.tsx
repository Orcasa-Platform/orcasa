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

import {
  useNetworkOrganizationFiltersOptions,
  useNetworkProjectFiltersOptions,
} from '@/hooks/networks';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MultiCombobox } from '@/components/ui/multi-combobox';

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = useNetworkFilterSidebarOpen();
  const [filters, setFilters] = useNetworkFilters();
  const [organizationFilters] = useNetworkOrganizationFilters();
  const organizationFiltersOptions = useNetworkOrganizationFiltersOptions();
  const projectFiltersOptions = useNetworkProjectFiltersOptions();
  const [projectFilters] = useNetworkProjectFilters();
  const organizationFiltersCount = useFiltersCount(organizationFilters);
  const projectFiltersCount = useFiltersCount(projectFilters);

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
                  organizationType: [],
                  thematic: [],
                  country: [],
                })
              }
            >
              Reset all
            </Button>
            <div className="space-y-4">
              <MultiCombobox
                name="Organisation type"
                variant="network-organization"
                value={filters.organizationType ?? []}
                options={organizationFiltersOptions.organizationType}
                onChange={(value) => setFilters({ ...filters, organizationType: value })}
              />
              <MultiCombobox
                name="Thematic"
                variant="network-organization"
                value={filters.thematic ?? []}
                options={organizationFiltersOptions.thematic}
                onChange={(value) => setFilters({ ...filters, thematic: value })}
              />
              <MultiCombobox
                name="Country"
                variant="network-organization"
                value={filters.country ?? []}
                options={organizationFiltersOptions.country}
                onChange={(value) => setFilters({ ...filters, country: value })}
              />
            </div>
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
                  projectType: [],
                  status: [],
                  coordinationCountry: [],
                  interventionRegion: [],
                  interventionCountry: [],
                  interventionArea: [],
                })
              }
            >
              Reset all
            </Button>
            <div className="space-y-4">
              <MultiCombobox
                name="Project type"
                variant="network-project"
                value={filters.projectType ?? []}
                options={projectFiltersOptions.projectType}
                onChange={(value) => setFilters({ ...filters, projectType: value })}
              />
              <MultiCombobox
                name="Status"
                variant="network-project"
                value={filters.status ?? []}
                options={projectFiltersOptions.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
              />
              <MultiCombobox
                name="Country of coordination"
                variant="network-project"
                value={filters.coordinationCountry ?? []}
                options={projectFiltersOptions.coordinationCountry}
                onChange={(value) => setFilters({ ...filters, coordinationCountry: value })}
              />
              <MultiCombobox
                name="Region of intervention"
                variant="network-project"
                value={filters.interventionRegion ?? []}
                options={projectFiltersOptions.interventionRegion}
                onChange={(value) => setFilters({ ...filters, interventionRegion: value })}
              />
              <MultiCombobox
                name="Country of intervention"
                variant="network-project"
                value={filters.interventionCountry ?? []}
                options={projectFiltersOptions.interventionCountry}
                onChange={(value) => setFilters({ ...filters, interventionCountry: value })}
              />
              <MultiCombobox
                name="Area of intervention"
                variant="network-project"
                value={filters.interventionArea ?? []}
                options={projectFiltersOptions.interventionArea}
                onChange={(value) => setFilters({ ...filters, interventionArea: value })}
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

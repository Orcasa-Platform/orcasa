'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';
import InfoButton from 'public/images/info-dark.svg';

import { cn } from '@/lib/classnames';

import { useNetworkFilterSidebarOpen, useNetworkFilters } from '@/store/network';

import {
  useNetworkOrganizationFiltersOptions,
  useNetworkProjectFiltersOptions,
} from '@/hooks/networks';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Reset from '@/styles/icons/reset.svg';

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = useNetworkFilterSidebarOpen();
  const [filters, setFilters] = useNetworkFilters();
  const organizationFiltersOptions = useNetworkOrganizationFiltersOptions();
  const projectFiltersOptions = useNetworkProjectFiltersOptions();

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
      className={cn('absolute left-full top-0 -z-10 h-full w-[380px] bg-gray-700 duration-500', {
        '-translate-x-full': !filterSidebarOpen,
        'translate-x-0': filterSidebarOpen,
      })}
    >
      <div
        ref={scrollableContainerRef}
        className="flex h-full flex-col gap-y-10 overflow-y-auto p-10 pt-4"
      >
        <Button
          ref={closeButtonRef}
          type="button"
          size="icon"
          className="absolute right-6 top-4 z-10"
          onClick={() => setFilterSidebarOpen(false)}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </Button>
        <h2 className="font-serif text-2xl text-yellow-500">Filters</h2>
        <Button
          type="button"
          size="xs"
          className="flex items-center gap-1 self-start !rounded-2xl pr-1 text-sm text-gray-50 hover:bg-gray-500 disabled:text-gray-300 disabled:opacity-100"
          onClick={() =>
            setFilters({
              ...filters,
              type: [],
              organizationType: [],
              thematic: [],
              country: [],
              projectType: [],
              status: [],
              year: [],
              coordinationCountry: [],
              interventionRegion: [],
              interventionCountry: [],
              interventionArea: [],
            })
          }
        >
          Reset all
          <Reset className="h-5 w-5" />
        </Button>

        <div className="space-y-6">
          <div>
            <label htmlFor="type" className="block pb-1 text-sm text-gray-200">
              I want to get
            </label>
            <Select
              value={filters.type?.toString()}
              onValueChange={(value) => setFilters({ ...filters, type: !value ? [] : [value] })}
            >
              <SelectTrigger id="type" className="!mt-0 h-10">
                <SelectValue>
                  <span className="text-sm">
                    {filters.type?.length === 1 &&
                      filters.type.includes('organization') &&
                      'Organisations'}
                    {filters.type?.length === 1 &&
                      filters.type.includes('project') &&
                      'Initiatives'}
                    {(!filters.type?.length || filters.type?.length === 2) &&
                      'Organisations and initiatives'}
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent variant="dark" className="w-[var(--radix-select-trigger-width)]">
                <SelectItem variant="dark" value="" className="w-full">
                  Organizations and initiatives
                </SelectItem>
                <SelectItem variant="dark" value="organization" className="w-full">
                  Organizations
                </SelectItem>
                <SelectItem variant="dark" value="project" className="w-full">
                  Initiatives
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="organisation-type" className="block pb-1 text-sm text-gray-200">
              Organisation type
            </label>
            <MultiCombobox
              id="organisation-type"
              name="Organisation type"
              placeholder="Select"
              variant="dark"
              value={filters.organizationType ?? []}
              options={organizationFiltersOptions.organizationType}
              onChange={(value) => setFilters({ ...filters, organizationType: value })}
              disabled={
                filters.type?.includes('project') && !filters.type?.includes('organization')
              }
            />
          </div>
          <div>
            <label htmlFor="organisation-thematic" className="block pb-1 text-sm text-gray-200">
              Organisation thematic
            </label>
            <MultiCombobox
              id="organisation-thematic"
              name="Organisation thematic"
              placeholder="Select"
              variant="dark"
              value={filters.thematic ?? []}
              options={organizationFiltersOptions.thematic}
              onChange={(value) => setFilters({ ...filters, thematic: value })}
              disabled={
                filters.type?.includes('project') && !filters.type?.includes('organization')
              }
            />
          </div>
          <div>
            <label htmlFor="organisation-country" className="block pb-1 text-sm text-gray-200">
              Organisation country
            </label>
            <MultiCombobox
              id="organisation-country"
              name="Organisation country"
              placeholder="Select"
              variant="dark"
              value={filters.country ?? []}
              options={organizationFiltersOptions.country}
              onChange={(value) => setFilters({ ...filters, country: value })}
              disabled={
                filters.type?.includes('project') && !filters.type?.includes('organization')
              }
            />
          </div>
          <div>
            <div className="flex items-center justify-start gap-2 pb-1">
              <label htmlFor="initiative-type" className="block text-sm text-gray-200">
                Initiative type
              </label>
              {projectFiltersOptions.projectType.some(({ description }) => !!description) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" size="auto" variant="icon">
                      <span className="sr-only">Info</span>
                      <InfoButton className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
                    <h1 className="font-serif text-2xl leading-10">Initiative types</h1>
                    {projectFiltersOptions.projectType
                      .filter(({ description }) => !!description)
                      .map(({ label, description }) => (
                        <div key={label}>
                          <h2 className="mb-2 text-sm font-semibold leading-7">{label}</h2>
                          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-650">
                            {description}
                          </p>
                        </div>
                      ))}
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <MultiCombobox
              id="initiative-type"
              name="Initiative type"
              placeholder="Select"
              variant="dark"
              value={filters.projectType ?? []}
              options={projectFiltersOptions.projectType}
              onChange={(value) => setFilters({ ...filters, projectType: value })}
              disabled={
                filters.type?.includes('organization') && !filters.type?.includes('project')
              }
            />
          </div>
          <div>
            <label htmlFor="initiative-status" className="block pb-1 text-sm text-gray-200">
              Initiative status
            </label>
            <MultiCombobox
              id="initiative-status"
              name="Initiative status"
              placeholder="Select"
              variant="dark"
              value={filters.status ?? []}
              options={projectFiltersOptions.status}
              onChange={(value) => setFilters({ ...filters, status: value })}
              disabled={
                filters.type?.includes('organization') && !filters.type?.includes('project')
              }
            />
          </div>
          <div>
            <label htmlFor="initiative-year" className="block pb-1 text-sm text-gray-200">
              Initiative active on year
            </label>
            <MultiCombobox
              id="initiative-year"
              name="Initiative active on year"
              variant="dark"
              placeholder="Select"
              value={filters.year ?? []}
              options={projectFiltersOptions.year}
              onChange={(value) => setFilters({ ...filters, year: value })}
              disabled={
                filters.type?.includes('organization') && !filters.type?.includes('project')
              }
            />
          </div>
          <div>
            <label
              htmlFor="initiative-coordination-country"
              className="block pb-1 text-sm text-gray-200"
            >
              {"Initiative's"} country of coordination
            </label>
            <MultiCombobox
              id="initiative-coordination-country"
              name="Initiative's country of coordination"
              placeholder="Select"
              variant="dark"
              value={filters.coordinationCountry ?? []}
              options={projectFiltersOptions.coordinationCountry}
              onChange={(value) => setFilters({ ...filters, coordinationCountry: value })}
              disabled={
                filters.type?.includes('organization') && !filters.type?.includes('project')
              }
            />
          </div>
          <div>
            <label
              htmlFor="initiative-intervention-region"
              className="block pb-1 text-sm text-gray-200"
            >
              {"Initiative's"} region of intervention
            </label>
            <MultiCombobox
              id="initiative-intervention-region"
              name="Initiative's region of intervention"
              placeholder="Select"
              variant="dark"
              value={filters.interventionRegion ?? []}
              options={projectFiltersOptions.interventionRegion}
              onChange={(value) => setFilters({ ...filters, interventionRegion: value })}
              disabled={
                filters.type?.includes('organization') && !filters.type?.includes('project')
              }
            />
          </div>
          <div>
            <label
              htmlFor="initiative-intervention-country"
              className="block pb-1 text-sm text-gray-200"
            >
              {"Initiative's"} country of intervention
            </label>
            <MultiCombobox
              id="initiative-intervention-country"
              name="Initiative's country of intervention"
              placeholder="Select"
              variant="dark"
              value={filters.interventionCountry ?? []}
              options={projectFiltersOptions.interventionCountry}
              onChange={(value) => setFilters({ ...filters, interventionCountry: value })}
              disabled={
                filters.type?.includes('organization') && !filters.type?.includes('project')
              }
            />
          </div>
          <div>
            <label
              htmlFor="initiative-intervention-area"
              className="block pb-1 text-sm text-gray-200"
            >
              {"Initiative's"} area of intervention
            </label>
            <MultiCombobox
              id="initiative-intervention-area"
              name="Initiative's area of intervention"
              placeholder="Select"
              variant="dark"
              value={filters.interventionArea ?? []}
              options={projectFiltersOptions.interventionArea}
              onChange={(value) => setFilters({ ...filters, interventionArea: value })}
              disabled={
                filters.type?.includes('organization') && !filters.type?.includes('project')
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

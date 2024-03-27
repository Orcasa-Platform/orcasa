'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { useDatasetsFilters, useFiltersCount } from '@/store/datasets';

import { DatasetSource } from '@/types/datasets';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function FiltersSidebar({
  filterSidebarOpen,
  setFilterSidebarOpen,
}: {
  filterSidebarOpen: boolean;
  setFilterSidebarOpen: (open: boolean) => void;
}) {
  const [filters, setFilters] = useDatasetsFilters();
  const filtersCount = useFiltersCount(['search']);

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
      className={cn('ml-6 h-full border-l border-gray-300 bg-gray-700 duration-500', {
        'w-0 shrink': !filterSidebarOpen,
        'w-[380px]': filterSidebarOpen,
      })}
    >
      <div
        ref={scrollableContainerRef}
        className="relative flex h-full flex-col gap-y-10 overflow-y-auto p-10 pt-4"
      >
        <Button
          ref={closeButtonRef}
          type="button"
          size="icon"
          className="absolute right-6 top-4"
          onClick={() => setFilterSidebarOpen(false)}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </Button>
        <h2 className="mb-6 font-serif text-2xl text-yellow-500">Filters</h2>
        <div className="flex flex-col gap-y-10">
          <fieldset>
            <legend className="mb-6 font-serif text-3.8xl">Filters</legend>
            <Button
              type="button"
              variant="vanilla"
              size="auto"
              className="text-base font-semibold text-purple-700 hover:text-purple-900 disabled:text-gray-300 disabled:opacity-100"
              disabled={filtersCount === 0}
              onClick={() =>
                setFilters({
                  ...filters,
                  source: [],
                  minDate: undefined,
                  maxDate: undefined,
                })
              }
            >
              Reset all
            </Button>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <MultiCombobox
                name="Source"
                value={filters.source ?? []}
                options={[
                  { label: 'Cirad dataverse', value: DatasetSource.Cirad },
                  { label: 'Harvard dataverse', value: DatasetSource.Harvard },
                  { label: 'Inrae dataverse', value: DatasetSource.Inrae },
                  { label: 'Joint Research Centre Data Catalogue', value: DatasetSource.JRC },
                  { label: 'Zenodo', value: DatasetSource.Zenodo },
                ]}
                onChange={(value) => setFilters({ ...filters, source: value })}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="vanilla"
                    size="auto"
                    className="relative w-full justify-start border border-gray-300 p-4 pr-12 text-base focus-visible:!outline-1 focus-visible:!outline-offset-0 focus-visible:!outline-gray-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[3px] data-[state=open]:border-gray-400"
                  >
                    {filters.minDate ? (
                      format({ id: 'formatDate', value: filters.minDate })
                    ) : (
                      <span>From date</span>
                    )}
                    <ChevronDown className="absolute right-4 top-4 h-6 w-6 flex-shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[330px] overflow-y-auto rounded-none border border-gray-400 p-0 text-base shadow-none"
                  side="bottom"
                  sideOffset={-1}
                  align="start"
                >
                  <Calendar
                    initialFocus
                    variant="datasets"
                    mode="single"
                    captionLayout="dropdown-buttons"
                    defaultMonth={filters.minDate ? new Date(filters.minDate) : undefined}
                    // `fromYear` and `toDate` are required to allow the user to quickly jump
                    // between years and months (see the `captionLayout` prop)
                    fromYear={2000}
                    toDate={
                      filters.maxDate
                        ? // We're making sure the user can't select the same date in both date
                          // pickers because the API considers the max date as exclusive
                          new Date(+new Date(filters.maxDate) - 24 * 3600 * 1000)
                        : new Date()
                    }
                    selected={filters.minDate ? new Date(filters.minDate) : undefined}
                    onSelect={(date) =>
                      setFilters({
                        ...filters,
                        minDate: date
                          ? `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
                              2,
                              '0',
                            )}-${`${date.getDate()}`.padStart(2, '0')}`
                          : undefined,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="vanilla"
                    size="auto"
                    className="relative w-full justify-start border border-gray-300 p-4 pr-12 text-base focus-visible:!outline-1 focus-visible:!outline-offset-0 focus-visible:!outline-gray-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[3px] data-[state=open]:border-gray-400"
                  >
                    {filters.maxDate ? (
                      format({ id: 'formatDate', value: filters.maxDate })
                    ) : (
                      <span>To date</span>
                    )}
                    <ChevronDown className="absolute right-4 top-4 h-6 w-6 flex-shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[330px] overflow-y-auto rounded-none border border-gray-400 p-0 text-base shadow-none"
                  side="bottom"
                  sideOffset={-1}
                  align="start"
                >
                  <Calendar
                    initialFocus
                    variant="datasets"
                    mode="single"
                    captionLayout="dropdown-buttons"
                    defaultMonth={filters.maxDate ? new Date(filters.maxDate) : undefined}
                    // `fromDate` and `toDate` are required to allow the user to quickly jump
                    // between years and months (see the `captionLayout` prop)
                    fromDate={
                      filters.minDate
                        ? // We're making sure the user can't select the same date in both date
                          // pickers because the API considers the max date as exclusive
                          new Date(+new Date(filters.minDate) + 24 * 3600 * 1000)
                        : new Date('2000-01-01')
                    }
                    toDate={new Date()}
                    selected={filters.maxDate ? new Date(filters.maxDate) : undefined}
                    onSelect={(date) =>
                      setFilters({
                        ...filters,
                        maxDate: date
                          ? `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(
                              2,
                              '0',
                            )}-${`${date.getDate()}`.padStart(2, '0')}`
                          : undefined,
                      })
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

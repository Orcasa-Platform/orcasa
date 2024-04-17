'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { useDatasetsFilters } from '@/store/datasets';

import { useDatasetsFiltersOptions } from '@/hooks/datasets';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Reset from '@/styles/icons/reset.svg';

export default function FiltersSidebar({
  isMobile = false,
  filterSidebarOpen,
  setFilterSidebarOpen,
}: {
  isMobile?: boolean;
  filterSidebarOpen?: boolean;
  setFilterSidebarOpen?: (open: boolean) => void;
}) {
  const [filters, setFilters] = useDatasetsFilters();

  const filtersOptions = useDatasetsFiltersOptions();

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

  const renderFilters = (
    <div className="relative mt-2 flex flex-col gap-y-10 p-4 lg:mt-0 lg:p-0">
      <fieldset className="flex flex-col lg:block">
        <Button
          type="button"
          size="xs"
          className="bottom-full flex -translate-y-4 items-center gap-1 self-end rounded-2xl text-sm text-gray-50 hover:bg-gray-500 disabled:text-gray-300 disabled:opacity-100 lg:absolute lg:left-0 lg:self-start"
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
          <Reset className="h-5 w-5" />
        </Button>
        <div className="space-y-6">
          <div>
            <label htmlFor="source" className="text-sm text-gray-200">
              Sources
            </label>
            <MultiCombobox
              id="source"
              name="Sources"
              placeholder="Select"
              value={filters.source ?? []}
              options={filtersOptions.source}
              onChange={(value) => setFilters({ ...filters, source: value })}
            />
          </div>
          <div>
            <label htmlFor="from-date" className="text-sm text-gray-200">
              From date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="from-date"
                  size="auto"
                  type="button"
                  className="flex h-10 w-full justify-between border border-gray-300 bg-gray-700 px-4 py-2 text-left text-base hover:!bg-gray-700 focus-visible:!outline-1 focus-visible:!outline-offset-0 focus-visible:!outline-green-700 data-[state=open]:border-gray-400"
                >
                  {filters.minDate ? (
                    format({ id: 'formatDate', value: filters.minDate })
                  ) : (
                    <span>Select</span>
                  )}
                  <ChevronDown className="h-6 w-6 flex-shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="mt-2.5 w-[330px] overflow-y-auto rounded-lg border border-gray-400 bg-gray-650 p-0 text-base shadow-none"
                side="bottom"
                sideOffset={-1}
                align="end"
              >
                <Calendar
                  initialFocus
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
          </div>
          <div>
            <label htmlFor="to-date" className="text-sm text-gray-200">
              To date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="to-date"
                  size="auto"
                  type="button"
                  className="flex h-10 w-full justify-between border border-gray-300 bg-gray-700 px-4 py-2 text-left text-base hover:!bg-gray-700 focus-visible:!outline-1 focus-visible:!outline-offset-0 focus-visible:!outline-green-700 data-[state=open]:border-gray-400"
                >
                  {filters.maxDate ? (
                    format({ id: 'formatDate', value: filters.maxDate })
                  ) : (
                    <span>Select</span>
                  )}
                  <ChevronDown className="h-6 w-6 flex-shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="mt-2.5 w-[330px] overflow-y-auto rounded-lg border border-gray-400 bg-gray-650 p-0 text-base shadow-none"
                side="bottom"
                sideOffset={-1}
                align="end"
              >
                <Calendar
                  initialFocus
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
        </div>
      </fieldset>
    </div>
  );

  if (isMobile) {
    return renderFilters;
  }

  return (
    <div
      // `inert` is not yet supported by React so that's why it is spread below:
      // https://github.com/facebook/react/issues/17157
      {...(!filterSidebarOpen ? { inert: '' } : {})}
      className={cn('h-full w-[275px] transform border-l border-gray-500 bg-gray-700')}
    >
      <div
        ref={scrollableContainerRef}
        className="relative flex h-full flex-col gap-y-10 overflow-y-auto p-10 pt-4 text-white"
      >
        <Button
          ref={closeButtonRef}
          type="button"
          size="icon"
          className="absolute right-6 top-4"
          onClick={() => setFilterSidebarOpen && setFilterSidebarOpen(false)}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </Button>
        <h2 className="mb-6 font-serif text-2xl text-yellow-500">Filters</h2>
        {renderFilters}
      </div>
    </div>
  );
}

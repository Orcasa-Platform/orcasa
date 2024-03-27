'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { useDatasetsFilters } from '@/store/datasets';

import { DatasetSource } from '@/types/datasets';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Reset from '@/styles/icons/reset.svg';

export default function FiltersSidebar({
  filterSidebarOpen,
  setFilterSidebarOpen,
}: {
  filterSidebarOpen: boolean;
  setFilterSidebarOpen: (open: boolean) => void;
}) {
  const [filters, setFilters] = useDatasetsFilters();

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
      className={cn('ml-6 h-full w-[275px] transform border-l border-gray-300 bg-gray-700')}
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
          onClick={() => setFilterSidebarOpen(false)}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4" />
        </Button>
        <h2 className="mb-6 font-serif text-2xl text-yellow-500">Filters</h2>
        <div className="relative flex flex-col gap-y-10">
          <fieldset>
            <Button
              type="button"
              size="xs"
              className="absolute bottom-full left-0 flex -translate-y-4 items-center gap-1 rounded-2xl text-sm text-gray-50 hover:bg-gray-500 disabled:text-gray-300 disabled:opacity-100"
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
                  options={[
                    { label: 'Cirad dataverse', value: DatasetSource.Cirad },
                    { label: 'Harvard dataverse', value: DatasetSource.Harvard },
                    { label: 'Inrae dataverse', value: DatasetSource.Inrae },
                    { label: 'Joint Research Centre Data Catalogue', value: DatasetSource.JRC },
                    { label: 'Zenodo', value: DatasetSource.Zenodo },
                  ]}
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
                    className="w-[330px] overflow-y-auto rounded-none border border-gray-400 p-0 text-base shadow-none"
                    side="bottom"
                    sideOffset={-1}
                    align="start"
                  >
                    <Calendar
                      id="from-date"
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
              </div>
              <div>
                <label htmlFor="to-date" className="text-sm text-gray-200">
                  To date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
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
                    className="w-[330px] overflow-y-auto rounded-none border border-gray-400 p-0 text-base shadow-none"
                    side="bottom"
                    sideOffset={-1}
                    align="start"
                  >
                    <Calendar
                      id="to-date"
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
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

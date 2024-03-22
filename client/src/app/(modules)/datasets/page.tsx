'use client';

import Image from 'next/image';

import { Filter, ChevronDown } from 'lucide-react';

import { format } from '@/lib/utils/formats';

import { useDatasetsFilters, useFiltersCount } from '@/store/datasets';

import { DatasetSource } from '@/types/datasets';
import { useGetPages } from '@/types/generated/page';

import { useGetDatasetsInfinite } from '@/hooks/datasets';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search } from '@/components/ui/search';

import { sourceToLogo } from './dataset';
import DatasetList from './dataset-list';

export default function DatasetsModule() {
  const [filters, setFilters] = useDatasetsFilters();
  const filtersCount = useFiltersCount(['search']);
  const query = useGetDatasetsInfinite({
    size: 20,
    q: filters.search,
    source: filters.source.length > 0 ? filters.source.join(',') : undefined,
    minDate: filters.minDate,
    maxDate: filters.maxDate,
  });
  const pages = useGetPages({ filters: { slug: 'datasets' } });
  const data = pages?.data?.data?.[0];
  const { attributes: { intro = undefined } = {} } = data || {};

  return (
    <>
      <h1 className="mb-14 font-serif leading-[30px]">
        {intro && <MarkdownRenderer variant="bold" content={intro} />}
      </h1>
      <Search
        containerClassName="w-full"
        placeholder="Search datasets"
        defaultValue={filters.search}
        onChange={(keywords) => setFilters({ ...filters, search: keywords })}
      />
      <div className="mt-5 flex flex-wrap items-center justify-end gap-10">
        {Object.entries(sourceToLogo).map(([source, { src, alt, width, height }]) => (
          <Image key={source} src={src} alt={alt} width={width} height={height} />
        ))}
      </div>
      <div className="mt-14 flex items-start justify-between border-t border-dashed border-t-gray-200 py-6">
        <p className="text-sm text-gray-500">
          {!!query.data &&
            query.data.pages.length > 0 &&
            `Showing ${query.data.pages[0].meta.total_records} datasets.`}
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="filters"
              className="group h-auto shrink-0 bg-purple-700 px-4 text-base hover:bg-purple-900"
            >
              <Filter className="mr-4 h-6 w-6" />
              Filters
              {filtersCount > 0 && (
                <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-purple-900 font-semibold transition group-hover:bg-gray-900">
                  {filtersCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle className="sr-only">Filters</DialogTitle>
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
          </DialogContent>
        </Dialog>
      </div>
      <DatasetList {...query} />
    </>
  );
}

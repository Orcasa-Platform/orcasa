'use client';

import { useState } from 'react';

import { X } from 'lucide-react';
import Filter from 'public/images/filter.svg';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { DatasetsFilters, useDatasetsFilters } from '@/store/datasets';

import { useGetPages } from '@/types/generated/page';

import { useDatasetsActiveFilters, useGetDatasetsInfinite } from '@/hooks/datasets';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

import DatasetList from './dataset-list';
import FiltersSidebar from './filters-sidebar';

export default function DatasetsModule() {
  const [filters, setFilters] = useDatasetsFilters();
  const activeFilters = useDatasetsActiveFilters();

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
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);

  return (
    <div className="container flex lg:max-w-[calc(100vw-90px)] xl:max-w-[1200px]">
      <div className="p-4 lg:p-10">
        <div className="mb-[30px]">
          <header className="mb-2 flex flex-col gap-4 lg:flex-row lg:gap-8 ">
            <h1 className="flex-1 font-serif leading-[30px] text-white">
              <div className="font-serif text-2xl text-white lg:hidden">Datasets</div>
              <div className="hidden lg:block">
                {intro && <MarkdownRenderer variant="bold" content={intro} />}
              </div>
            </h1>
            <div className="flex flex-1 gap-2">
              <Search
                containerClassName="basis-full h-9 text-white"
                placeholder="Search"
                defaultValue={filters.search}
                onChange={(keywords) => setFilters({ ...filters, search: keywords })}
              />
              <Button
                type="button"
                variant={filterSidebarOpen ? 'filters' : 'primary'}
                className="group hidden shrink-0 transition-colors duration-500 lg:flex"
                onClick={() => {
                  setFilterSidebarOpen(!filterSidebarOpen);
                }}
              >
                <Filter className="mr-4 h-6 w-6" />
                Filters
              </Button>
            </div>
          </header>
          <div className="flex-wrap gap-2">
            {activeFilters.map(({ filter, label, value }) => (
              <Button
                key={[filter, value].join('-')}
                type="button"
                variant="filter-tag"
                size="xs"
                title={label}
                onClick={() => {
                  const filterValue = filters?.[filter as keyof DatasetsFilters];
                  setFilters({
                    ...filters,
                    [filter]: Array.isArray(filterValue)
                      ? filterValue?.filter((filterValue) => filterValue !== value)
                      : undefined,
                  });
                }}
              >
                <span className="sr-only">Remove filter:&nbsp;</span>
                <span className="line-clamp-1">{label}</span>
                <X className="ml-1 h-4 w-4 shrink-0" />
              </Button>
            ))}
            {!!filters.minDate && !filters.maxDate && (
              <Button
                type="button"
                variant="filter-tag"
                size="xs"
                onClick={() => {
                  setFilters({
                    ...filters,
                    minDate: undefined,
                  });
                }}
              >
                <span className="sr-only">Remove filter:&nbsp;</span>
                <span className="line-clamp-1">
                  From {format({ id: 'formatDate', value: filters.minDate })}
                </span>
                <X className="ml-1 h-4 w-4 shrink-0" />
              </Button>
            )}
            {!filters.minDate && !!filters.maxDate && (
              <Button
                type="button"
                variant="filter-tag"
                size="xs"
                onClick={() => {
                  setFilters({
                    ...filters,
                    maxDate: undefined,
                  });
                }}
              >
                <span className="sr-only">Remove filter:&nbsp;</span>
                <span className="line-clamp-1">
                  To {format({ id: 'formatDate', value: filters.maxDate })}
                </span>
                <X className="ml-1 h-4 w-4 shrink-0" />
              </Button>
            )}
            {!!filters.minDate && !!filters.maxDate && (
              <Button
                type="button"
                variant="filter-tag"
                size="xs"
                onClick={() => {
                  setFilters({
                    ...filters,
                    minDate: undefined,
                    maxDate: undefined,
                  });
                }}
              >
                <span className="sr-only">Remove filter:&nbsp;</span>
                <span className="line-clamp-1">
                  {format({ id: 'formatDate', value: filters.minDate })} to{' '}
                  {format({ id: 'formatDate', value: filters.maxDate })}
                </span>
                <X className="ml-1 h-4 w-4 shrink-0" />
              </Button>
            )}
          </div>
        </div>
        <p className="mb-5 flex items-start justify-between text-sm text-gray-200">
          {!!query.data &&
            query.data.pages.length > 0 &&
            `Showing ${query.data.pages[0].meta.total_records} datasets.`}
        </p>
        <DatasetList {...query} />
      </div>
      <div
        className={cn(
          'fixed right-0 hidden h-full transform transition-transform duration-500 lg:block',
          {
            'translate-x-full': !filterSidebarOpen,
            'translate-x-0': filterSidebarOpen,
          },
        )}
      >
        <FiltersSidebar
          filterSidebarOpen={filterSidebarOpen}
          setFilterSidebarOpen={setFilterSidebarOpen}
        />
      </div>
    </div>
  );
}

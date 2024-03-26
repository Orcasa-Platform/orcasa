'use client';

import { useState } from 'react';

import { Filter } from 'lucide-react';

import { useDatasetsFilters, useFiltersCount } from '@/store/datasets';

import { useGetPages } from '@/types/generated/page';

import { useGetDatasetsInfinite } from '@/hooks/datasets';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

import DatasetList from './dataset-list';
import FiltersSidebar from './filters-sidebar';

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
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  return (
    <div className="container flex lg:max-w-[calc(100vw-90px)] xl:max-w-[1200px]">
      <div className="p-10">
        <header className="mb-[30px] flex">
          <h1 className="font-serif leading-[30px] text-white">
            {intro && <MarkdownRenderer variant="bold" content={intro} />}
          </h1>
          <Search
            containerClassName="basis-full"
            placeholder="Search"
            defaultValue={filters.search}
            onChange={(keywords) => setFilters({ ...filters, search: keywords })}
          />
          <Button
            type="button"
            variant={filterSidebarOpen ? 'filters' : 'primary'}
            className="group shrink-0 transition-colors duration-500"
            onClick={() => {
              setFilterSidebarOpen(!filterSidebarOpen);
            }}
          >
            <Filter className="mr-4 h-6 w-6" />
            Filters
            {filtersCount > 0 && (
              <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-full bg-purple-900 font-semibold transition group-hover:bg-gray-900">
                {filtersCount}
              </span>
            )}
          </Button>
        </header>
        <p className="mb-5 flex items-start justify-between text-sm text-gray-200">
          {!!query.data &&
            query.data.pages.length > 0 &&
            `Showing ${query.data.pages[0].meta.total_records} datasets.`}
        </p>
        <DatasetList {...query} />
      </div>
      <div>
        <FiltersSidebar
          filterSidebarOpen={filterSidebarOpen}
          setFilterSidebarOpen={setFilterSidebarOpen}
        />
      </div>
    </div>
  );
}

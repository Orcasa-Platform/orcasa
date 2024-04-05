'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { usePracticesFilterSidebarOpen, usePracticesFilters, SourceName } from '@/store/practices';

import { usePracticesFiltersOptions } from '@/hooks/practices';

import { Button } from '@/components/ui/button';
import InfoTooltip from '@/components/ui/info-tooltip';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import Reset from '@/styles/icons/reset.svg';

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const SelectFilter = ({
  source,
  type,
  label,
  disabled,
  multiple,
  placeholder,
  setFilters,
  practicesFiltersOptions,
  filters,
}: {
  source?: keyof typeof practicesFiltersOptions;
  type: keyof typeof practicesFiltersOptions;
  label: string;
  disabled?: boolean;
  multiple?: boolean;
  placeholder?: string;
  setFilters: (filters: ReturnType<typeof usePracticesFilters>[0]) => void;
  practicesFiltersOptions: ReturnType<typeof usePracticesFiltersOptions>;
  filters: ReturnType<typeof usePracticesFilters>[0];
}) => {
  const selectedLabel = practicesFiltersOptions[source || type]?.find(
    ({ value }) => value === filters[type],
  )?.label;

  const handleValueChange = (value: string | number | undefined) => {
    let returnedValue: string | number | undefined = value === 'all' ? undefined : value;

    if (typeof returnedValue === 'string') {
      const selectedOption = practicesFiltersOptions[source || type].find(
        ({ value }) => String(value) === returnedValue,
      );
      if (selectedOption && typeof selectedOption.value === 'number') {
        returnedValue = +returnedValue;
      }
    }

    return setFilters({
      ...filters,
      [type]: returnedValue,
    });
  };

  const options = practicesFiltersOptions[source || type].sort((a, b) =>
    a.label.localeCompare(b.label),
  );

  const select = !multiple ? (
    <Select value={String(filters[type])} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger id={toKebabCase(type)} className="!mt-0 h-10">
        <SelectValue>
          <span className="text-sm">{selectedLabel ? selectedLabel : placeholder || 'All'}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent variant="dark" className="w-[var(--radix-select-trigger-width)]">
        <SelectItem variant="dark" key="all" value="" className="w-full border-gray-300">
          All
        </SelectItem>
        {options.map(({ label, value }) => (
          <SelectItem variant="dark" key={value} value={String(value)} className="w-full">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <MultiCombobox
      id={toKebabCase(type)}
      key={toKebabCase(type)}
      name={label}
      value={filters[type] ? (filters[type] as number[]) : []}
      options={options || []}
      onChange={(value) =>
        setFilters({
          ...filters,
          [type]: value,
        })
      }
      disabled={disabled}
      className="!mt-0"
    />
  );

  return (
    <>
      <label htmlFor={toKebabCase(type)} className="block text-sm text-gray-200">
        {label}
      </label>
      {disabled ? (
        <InfoTooltip
          triggerContent={select}
          content={
            <p className="text-xs leading-normal">
              You have to select a <span className="font-semibold">land use type</span> and a{' '}
              <span className="font-semibold">main intervention</span> first.
            </p>
          }
          className="max-w-[var(--radix-tooltip-trigger-width)]"
          triggerClassName="!mt-0 w-full"
          sideOffset={20}
        />
      ) : (
        select
      )}
    </>
  );
};

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = usePracticesFilterSidebarOpen();
  const [filters, setFilters] = usePracticesFilters();
  const practicesFiltersOptions = usePracticesFiltersOptions(filters);

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
              country: [],
              year: [],
              landUseTypes: [],
              priorLandUseTypes: [],
              mainIntervention: undefined,
              subInterventions: [],
              sourceName: [],
            })
          }
        >
          Reset all
          <Reset className="h-5 w-5" />
        </Button>
        <div className="space-y-6">
          <div>
            <label htmlFor="source" className="block pb-1 text-sm text-gray-200">
              Sources
            </label>
            <MultiCombobox
              id="source"
              key="source"
              name="Sources"
              placeholder="Select"
              value={filters.sourceName ?? []}
              options={practicesFiltersOptions.sourceName}
              onChange={(value) => setFilters({ ...filters, sourceName: value as SourceName[] })}
            />
          </div>
          <div>
            <label htmlFor="country" className="block pb-1 text-sm text-gray-200">
              Country
            </label>
            <MultiCombobox
              id="country"
              key="country"
              name="Country"
              placeholder="Select"
              value={filters.country ?? []}
              options={practicesFiltersOptions.country}
              onChange={(value) => setFilters({ ...filters, country: value as number[] })}
            />
          </div>
          <div>
            <label htmlFor="published-year" className="block pb-1 text-sm text-gray-200">
              Published year
            </label>
            <MultiCombobox
              id="published-year"
              name="Published on year"
              placeholder="Select"
              value={filters.year ?? []}
              options={practicesFiltersOptions.year}
              onChange={(value) => setFilters({ ...filters, year: value as number[] })}
            />
          </div>
          <SelectFilter
            type="mainIntervention"
            label="Main intervention"
            placeholder="Select"
            setFilters={setFilters}
            practicesFiltersOptions={practicesFiltersOptions}
            filters={filters}
          />
          <SelectFilter
            source="landUseTypes"
            type={
              filters?.mainIntervention === 'Land Use Change' ? 'priorLandUseTypes' : 'landUseTypes'
            }
            label="Land use type"
            multiple
            setFilters={setFilters}
            practicesFiltersOptions={practicesFiltersOptions}
            filters={filters}
          />
          {filters?.mainIntervention === 'Land Use Change' && (
            <SelectFilter
              type="landUseTypes"
              label="New land use type"
              multiple
              setFilters={setFilters}
              practicesFiltersOptions={practicesFiltersOptions}
              filters={filters}
            />
          )}
          {filters?.mainIntervention === 'Management' && (
            <SelectFilter
              type="subInterventions"
              label="Sub-intervention"
              disabled={!filters.landUseTypes?.length || !filters.mainIntervention}
              multiple
              setFilters={setFilters}
              practicesFiltersOptions={practicesFiltersOptions}
              filters={filters}
            />
          )}
        </div>
      </div>
    </div>
  );
}

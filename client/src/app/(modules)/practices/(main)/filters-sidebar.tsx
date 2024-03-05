'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { usePracticesFilterSidebarOpen, usePracticesFilters } from '@/store/practices';

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

const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const SelectFilter = ({
  source,
  type,
  label,
  disabled,
  multiple,
  setFilters,
  practicesFiltersOptions,
  filters,
}: {
  source?: keyof typeof practicesFiltersOptions;
  type: keyof typeof practicesFiltersOptions;
  label: string;
  disabled?: boolean;
  multiple?: boolean;
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

    // When we select Land use change as Main intervention
    // we should move the current value of Land use type to Land use type prior
    // to match the Scientific Evidence functionality
    const getMainInterventionUpdates = () => {
      if (type !== 'mainIntervention') return {};
      if (value === 'Land Use Change') {
        return { landUseTypes: undefined, priorLandUseTypes: filters.landUseTypes };
      }
      // Reset the filters when the main intervention is Management or all
      return {
        landUseTypes: filters.priorLandUseTypes || filters.landUseTypes,
        priorLandUseTypes: undefined,
      };
    };
    return setFilters({
      ...filters,
      [type]: returnedValue,
      ...getMainInterventionUpdates(),
    });
  };

  const options = practicesFiltersOptions[source || type].sort((a, b) =>
    a.label.localeCompare(b.label),
  );
  const select = !multiple ? (
    <Select value={String(filters[type])} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger id={toKebabCase(type)} className="!mt-0 h-12">
        <SelectValue>
          <span className="text-sm">{selectedLabel ? selectedLabel : 'All'}</span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="w-[var(--radix-select-trigger-width)]">
        <SelectItem key="all" value="all" className="w-full border-b border-dashed border-gray-300">
          All
        </SelectItem>
        {options.map(({ label, value }) => (
          <SelectItem key={value} value={String(value)} className="w-full capitalize">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : (
    <MultiCombobox
      id={toKebabCase(type)}
      key={toKebabCase(type)}
      name={toKebabCase(type)}
      variant="practices"
      value={filters[type] ? (filters[type] as number[]) : []}
      options={options || []}
      onChange={(value) =>
        setFilters({
          ...filters,
          [type]: value,
        })
      }
      disabled={disabled}
      className="!mt-0 max-w-[284px] capitalize"
      showSelected
    />
  );

  return (
    <>
      <label htmlFor={toKebabCase(type)} className="block text-sm font-medium text-gray-700">
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
        <h1 className="mb-6 font-serif text-3.8xl">Filters</h1>
        <div className="flex flex-col gap-y-10">
          <fieldset className="relative">
            <Button
              type="button"
              variant="vanilla"
              size="auto"
              className="absolute bottom-full left-0 -translate-y-4 text-base font-semibold text-brown-500 hover:text-brown-800 disabled:text-gray-300 disabled:opacity-100"
              onClick={() =>
                setFilters({
                  ...filters,
                  country: [],
                  year: [],
                  landUseTypes: undefined,
                  priorLandUseTypes: undefined,
                  mainIntervention: undefined,
                  subInterventions: undefined,
                })
              }
            >
              Reset all
            </Button>
            <div className="space-y-4">
              <MultiCombobox
                id="country"
                key="country"
                name="Country"
                variant="practices"
                value={filters.country ?? []}
                options={practicesFiltersOptions.country}
                onChange={(value) => setFilters({ ...filters, country: value as number[] })}
              />
              <MultiCombobox
                id="publised-year"
                name="Published on year"
                variant="practices"
                value={filters.year ?? []}
                options={practicesFiltersOptions.year}
                onChange={(value) => setFilters({ ...filters, year: value as number[] })}
              />
              <SelectFilter
                type="mainIntervention"
                label="Main intervention"
                setFilters={setFilters}
                practicesFiltersOptions={practicesFiltersOptions}
                filters={filters}
              />
              <SelectFilter
                source="landUseTypes"
                type={
                  filters?.mainIntervention === 'Land Use Change'
                    ? 'priorLandUseTypes'
                    : 'landUseTypes'
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
          </fieldset>
        </div>
      </div>
    </div>
  );
}

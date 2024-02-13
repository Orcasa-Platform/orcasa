'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { usePracticesFilterSidebarOpen, usePracticesFilters } from '@/store/practices';

import { usePracticesFiltersOptions } from '@/hooks/practices';

import { Button } from '@/components/ui/button';
import { MultiCombobox } from '@/components/ui/multi-combobox';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
} from '@/components/ui/tooltip';

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
  const toKebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

  const SelectFilter = ({
    source,
    type,
    label,
    disabled,
    multiple,
  }: {
    source?: keyof typeof practicesFiltersOptions;
    type: keyof typeof practicesFiltersOptions;
    label: string;
    disabled?: boolean;
    multiple?: boolean;
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
    const handleMultipleValueChange = (value: (string | number)[] | undefined) => {
      return setFilters({
        ...filters,
        [type]: value,
      });
    };

    const select = !multiple ? (
      <Select value={String(filters[type])} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger id={toKebabCase(type)} className="!mt-0 h-12 w-full">
          <SelectValue>
            <span className="text-sm">{selectedLabel ? selectedLabel : 'All'}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            key="all"
            value="all"
            className="w-full border-b border-dashed border-gray-300"
          >
            All
          </SelectItem>
          {practicesFiltersOptions[source || type].map(({ label, value }) => (
            <SelectItem key={value} value={String(value)} className="w-full">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ) : (
      <MultiCombobox
        name={toKebabCase(type)}
        variant="practices"
        selectedLabel={filters[type]?.length ? `${label} (${filters[type]?.length})` : 'All'}
        value={filters[type] ? (filters[type] as number[]) : []}
        options={practicesFiltersOptions[source || type] || []}
        onChange={handleMultipleValueChange}
        disabled={disabled}
        className="!mt-0"
      />
    );

    return (
      <>
        <label htmlFor={toKebabCase(type)} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {disabled ? (
          <TooltipProvider>
            <Tooltip delayDuration={0}>
              <TooltipTrigger className="!mt-0 w-full">{select}</TooltipTrigger>
              <TooltipContent
                sideOffset={20}
                variant="dark"
                align="start"
                className="max-w-[var(--radix-tooltip-trigger-width)]"
              >
                <p className="text-xs leading-normal">
                  You have to select a <span className="font-semibold">land use type</span> and a{' '}
                  <span className="font-semibold">main intervention</span> first.
                </p>
                <TooltipArrow variant="dark" />
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          select
        )}
      </>
    );
  };

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
                name="Country"
                variant="practices"
                value={filters.country ?? []}
                options={practicesFiltersOptions.country}
                onChange={(value) => setFilters({ ...filters, country: value as number[] })}
              />
              <SelectFilter type="mainIntervention" label="Main intervention" />
              <SelectFilter
                source="landUseTypes"
                type={
                  filters?.mainIntervention === 'Land Use Change'
                    ? 'priorLandUseTypes'
                    : 'landUseTypes'
                }
                label="Land use type"
                multiple
              />
              {filters?.mainIntervention === 'Land Use Change' && (
                <SelectFilter type="landUseTypes" label="New land use type" multiple />
              )}
              {filters?.mainIntervention === 'Management' && (
                <SelectFilter
                  type="subInterventions"
                  label="Sub-intervention"
                  disabled={!filters.landUseTypes?.length || !filters.mainIntervention}
                  multiple
                />
              )}
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

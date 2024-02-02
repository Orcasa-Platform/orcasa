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
  const practicesFiltersOptions = usePracticesFiltersOptions();
  const [filters, setFilters] = usePracticesFilters();
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
    type,
    placeholder,
    disabled,
  }: {
    type: keyof typeof practicesFiltersOptions;
    placeholder: string;
    disabled?: boolean;
  }) => {
    const selectedLabel = practicesFiltersOptions[type].find(
      ({ value }) => value === filters[type],
    )?.label;
    const select = (
      <Select
        value={String(filters[type])}
        onValueChange={(value) =>
          setFilters({ ...filters, [type]: value === 'all' ? undefined : +value })
        }
        disabled={disabled}
      >
        <SelectTrigger id={toKebabCase(type)} className="h-12 w-full">
          <SelectValue>
            <span className="text-sm">
              {`${placeholder}${selectedLabel ? `: ${selectedLabel}` : ''}`}
            </span>
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
          {practicesFiltersOptions[type].map(({ label, value }) => (
            <SelectItem key={value} value={String(value)} className="w-full">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );

    return disabled ? (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger className="w-full">{select}</TooltipTrigger>
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
        <h1 className="font-serif text-3.8xl">Filters</h1>
        <div className="flex flex-col gap-y-10">
          <fieldset className="relative">
            <Button
              type="button"
              variant="vanilla"
              size="auto"
              className="absolute bottom-full right-0 -translate-y-4 text-base font-semibold text-brown-500 hover:text-brown-800 disabled:text-gray-300 disabled:opacity-100"
              onClick={() =>
                setFilters({
                  ...filters,
                  country: [],
                  landUseType: undefined,
                  mainIntervention: undefined,
                  subIntervention: undefined,
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
              <SelectFilter type="landUseType" placeholder="Land use type" />
              <SelectFilter type="mainIntervention" placeholder="Main intervention" />
              <SelectFilter
                type="subIntervention"
                placeholder="Sub intervention"
                disabled={!filters.landUseType || !filters.mainIntervention}
              />
            </div>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

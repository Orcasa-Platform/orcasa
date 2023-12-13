import React, { Key, useEffect, useMemo, useRef, useState } from 'react';

import { Combobox as ComboboxPrimitive } from '@headlessui/react';
import { type VariantProps, cva } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const optionVariants = cva('py-4 px-3 flex items-start gap-x-2 group', {
  variants: {
    variant: {
      default: '',
      'network-organization': 'hover:bg-blue-50 data-[headlessui-state*=active]:bg-blue-50',
      'network-project': 'hover:bg-peach-50 data-[headlessui-state*=active]:bg-peach-50',
      datasets: 'hover:bg-purple-50 data-[headlessui-state*=active]:bg-purple-50',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const buttonVariants = cva('text-base font-semibold disabled:text-gray-300 disabled:opacity-100', {
  variants: {
    variant: {
      default: '',
      'network-organization': 'text-blue-500 hover:text-blue-800',
      'network-project': 'text-peach-700 hover:text-peach-900',
      datasets: 'text-purple-700 hover:text-purple-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ComboboxProps<T> {
  id?: string;
  name?: string;
  variant?: VariantProps<typeof optionVariants>['variant'];
  value: T[];
  options: { label: string; value: T }[];
  onChange: (value: T[]) => void;
  disabled?: boolean;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export const MultiCombobox = <T extends NonNullable<unknown>>({
  id,
  name = 'Select',
  variant,
  value,
  options,
  onChange,
  disabled = false,
  ariaDescribedBy,
  ariaInvalid,
}: ComboboxProps<T>) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredOptions = useMemo(
    () =>
      search.length === 0
        ? options
        : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(search.toLowerCase().replace(/\s+/g, '')),
        ),
    [options, search],
  );

  // If the combobox becomes disabled, then we close it
  useEffect(() => {
    if (disabled) {
      setOpen(false);
    }
  }, [disabled, setOpen]);

  // Close the dropdown if the user clicks elsewhere
  useEffect(() => {
    const onClickDocument = (e: MouseEvent) => {
      const isClickInside = containerRef.current?.contains(e.target as HTMLElement) ?? false;
      if (!isClickInside) {
        setOpen(false);
      }
    };

    document.addEventListener('click', onClickDocument, { capture: true });

    return () => document.removeEventListener('click', onClickDocument, { capture: true });
  }, [containerRef, setOpen]);
  return (
    <div
      ref={containerRef}
      className="relative text-base"
      aria-describedby={ariaDescribedBy}
      aria-invalid={ariaInvalid}
    >
      <ComboboxPrimitive multiple value={value} onChange={onChange}>
        {!open && (
          <Button
            id={id}
            type="button"
            role="combobox"
            variant="vanilla"
            size="auto"
            className="relative w-full justify-between border border-gray-300 p-4 pr-12 text-base focus-visible:!outline-1 focus-visible:!outline-offset-0 focus-visible:!outline-gray-300 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-[3px]"
            onClick={() => setOpen(true)}
            disabled={disabled}
          >
            {`${name}${value.length > 0 ? ` (${value.length})` : ''}`}
            <ChevronDown className="absolute right-4 top-4 h-6 w-6 flex-shrink-0" />
          </Button>
        )}
        {open && (
          <>
            <Tooltip open delayDuration={0}>
              <TooltipTrigger asChild>
                <ComboboxPrimitive.Input
                  autoFocus
                  className="placeholder:font-base w-full border border-gray-400 p-4 pr-12 placeholder:font-sans placeholder:text-gray-400 focus-visible:outline-none focus-visible:outline-gray-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Search…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </TooltipTrigger>

              <Button
                type="button"
                variant="vanilla"
                size="auto"
                className="absolute right-4 top-4"
                onClick={() => setOpen(false)}
                disabled={disabled}
              >
                <span className="sr-only">Close combobox</span>
                <ChevronDown className="h-6 w-6 flex-shrink-0 rotate-180" />
              </Button>
              <TooltipContent
                side="bottom"
                sideOffset={-1}
                className="max-h-80 w-[var(--radix-tooltip-trigger-width)] overflow-y-auto rounded-none border border-gray-400 p-0 text-base shadow-none"
              >
                <div className="sticky top-0 flex gap-x-4 border-b border-dashed border-gray-300 bg-white px-3 py-4">
                  <Button
                    type="button"
                    variant="vanilla"
                    size="auto"
                    className={buttonVariants({ variant })}
                    disabled={value.length === options.length}
                    onClick={() => onChange(options.map(({ value }) => value))}
                  >
                    Select all
                  </Button>
                  <Button
                    type="button"
                    variant="vanilla"
                    size="auto"
                    className={buttonVariants({ variant })}
                    disabled={value.length === 0}
                    onClick={() => onChange([])}
                  >
                    Clear
                  </Button>
                </div>
                {filteredOptions.length === 0 && search.length > 0 && (
                  <p className="py-8 text-center text-gray-700">No results</p>
                )}
                <ComboboxPrimitive.Options static>
                  {filteredOptions.map((option) => {
                    const isDefaultChecked =
                      value.findIndex((value) => value === option.value) !== -1;

                    return (
                      <ComboboxPrimitive.Option
                        key={option.value as Key}
                        value={option.value}
                        className={cn(optionVariants({ variant }))}
                      >
                        <Checkbox
                          // For some reason, the `MultiCombobox` component initiates an infinite loop
                          // when used inside a React Hook Form if this checkbox has a `checked`
                          // property.
                          // The workaround here is to:
                          // 1. Use `defaultChecked` instead of `checked`
                          // 2. Mount/unmount the checkbox when the check status has changed (using
                          // the `key` property).
                          key={`${isDefaultChecked}-${option.value}`}
                          id={`multi-combobox-option-${option.value}`}
                          defaultChecked={isDefaultChecked}
                          className="mt-0.5 shrink-0 group-hover:border-gray-900 group-data-[headlessui-state*=active]:border-gray-900"
                        />
                        <Label
                          htmlFor={`multi-combobox-option-${option.value}`}
                          className="pointer-events-none leading-normal"
                        >
                          {option.label}
                        </Label>
                      </ComboboxPrimitive.Option>
                    );
                  })}
                </ComboboxPrimitive.Options>
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </ComboboxPrimitive>
    </div>
  );
};

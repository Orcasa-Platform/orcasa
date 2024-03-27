import React, { Key, useEffect, useMemo, useRef, useState } from 'react';

import { Combobox as ComboboxPrimitive } from '@headlessui/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const optionVariants = cva('py-3 h-10 px-3 flex items-start gap-x-2 group', {
  variants: {
    variant: {
      default: '',
      // To review
      'network-organization': '',
      'network-initiative': '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const buttonVariants = cva(
  'text-base font-semibold text-green-700 hover:text-green-800 disabled:text-gray-500 disabled:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-0',
  {
    variants: {
      variant: {
        default: '',
        // To review
        'network-organization': '',
        'network-initiative': '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ComboboxProps<T> {
  id?: string;
  name?: string;
  variant?: VariantProps<typeof optionVariants>['variant'];
  value: T[];
  options: { label: string; value: T; disabled?: boolean; description?: string }[];
  onChange: (value: T[]) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
  showSelected?: boolean;
  className?: string;
  allowSelectAll?: boolean;
}

export const MultiCombobox = <T extends NonNullable<unknown>>({
  id,
  name = 'Select',
  variant,
  value,
  options,
  onChange,
  placeholder,
  disabled = false,
  ariaDescribedBy,
  ariaInvalid,
  showSelected = false,
  className,
  allowSelectAll = true,
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
  const selectedLabels =
    value.length === 0
      ? 'Select'
      : options
          .filter((option) => value.includes(option.value))
          .map((option) => option.label)
          .join(', ');
  return (
    <div
      ref={containerRef}
      className={cn(
        'relative text-base',
        {
          'pointer-events-none cursor-not-allowed': disabled,
        },
        className,
      )}
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
            className={cn(
              'relative h-10 w-full justify-between rounded-lg border border-gray-300 px-4 py-2 text-base focus-visible:ring-offset-0',
            )}
            title={selectedLabels}
            onClick={() => setOpen(true)}
            disabled={disabled}
          >
            {showSelected ? (
              <span className={cn({ 'max-h-14 max-w-full truncate capitalize': showSelected })}>
                {selectedLabels}
              </span>
            ) : value.length > 0 ? (
              `${name} (${value.length})`
            ) : (
              placeholder ?? name
            )}
            <ChevronDown className="absolute right-4 top-2 h-6 w-6 flex-shrink-0" />
          </Button>
        )}
        {open && (
          <>
            <Tooltip open delayDuration={0}>
              <TooltipTrigger asChild>
                <ComboboxPrimitive.Input
                  autoFocus
                  className="placeholder:font-base h-10 w-full rounded-lg border border-gray-400 bg-gray-700 p-2 pl-4 pr-14 placeholder:text-gray-400 focus-visible:outline-none focus-visible:outline-gray-400 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </TooltipTrigger>

              <Button
                type="button"
                variant="vanilla"
                size="auto"
                className="absolute right-4 top-2"
                onClick={() => setOpen(false)}
                disabled={disabled}
              >
                <span className="sr-only">Close combobox</span>
                <ChevronDown className="h-6 w-6 flex-shrink-0 rotate-180" />
              </Button>
              <TooltipContent
                side="bottom"
                sideOffset={-1}
                className="mt-2.5 max-h-80 w-[var(--radix-tooltip-trigger-width)] overflow-y-auto rounded-lg border border-gray-400 bg-gray-650 p-0 text-base shadow-none"
              >
                <div className="sticky top-0 z-10 flex justify-end gap-x-4 border-b border-gray-400 bg-gray-650 px-3 py-2">
                  {allowSelectAll && (
                    <Button
                      type="button"
                      variant="vanilla"
                      size="auto"
                      className={buttonVariants({ variant })}
                      disabled={value.length === options.length}
                      onClick={() =>
                        onChange(
                          options.filter(({ disabled }) => !disabled).map(({ value }) => value),
                        )
                      }
                    >
                      Select all
                    </Button>
                  )}
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
                {filteredOptions.length === 0 && (
                  <p className="py-8 text-center text-white">No results</p>
                )}
                <ComboboxPrimitive.Options static>
                  {filteredOptions.map((option) => {
                    const isDefaultChecked =
                      value.findIndex((value) => value === option.value) !== -1;

                    return (
                      <ComboboxPrimitive.Option
                        key={option.value as unknown as Key}
                        value={option.value}
                        disabled={option.disabled}
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
                          className="mt-0.5 shrink-0"
                          disabled={option.disabled}
                        />
                        <Label
                          htmlFor={`multi-combobox-option-${option.value}`}
                          className="pointer-events-none leading-normal"
                        >
                          {option.label}
                          {option.description && (
                            <div className="mt-3 text-sm leading-7 text-gray-500">
                              {option.description}
                            </div>
                          )}
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

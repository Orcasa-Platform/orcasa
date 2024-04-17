'use client';

import { ComponentProps, ReactElement, ChangeEvent, Children, useMemo } from 'react';

import { CaptionLabel, DayPicker } from 'react-day-picker';

import { cva, type VariantProps } from 'class-variance-authority';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const calendarDayVariants = cva('text-white hover:text-white focus:text-white', {
  variants: {
    variant: {
      default: 'bg-purple-700 focus:bg-purple-700',
      dark: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type CalendarProps = ComponentProps<typeof DayPicker> &
  VariantProps<typeof calendarDayVariants>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  variant,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-6 text-gray-700', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4 w-full',
        caption: 'flex justify-center pb-6 relative items-center',
        caption_label: 'text-sm font-medium',
        caption_dropdowns: 'flex gap-x-4',
        vhidden: 'hidden',
        nav: 'space-x-1 flex items-center',
        nav_button: cn(buttonVariants({ variant: 'icon-primary', size: 'icon' })),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'mx-auto border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-white rounded-md w-10 font-semibold text-sm',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-10 p-0 font-semibold aria-selected:opacity-100 cursor-pointer text-white',
        ),
        day_range_end: 'day-range-end',
        day_selected: calendarDayVariants({ variant }),
        day_today: 'bg-gray-600',
        day_outside: 'day-outside text-muted-foreground opacity-50 aria-selected:opacity-100',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-gray-300 aria-selected:text-gray-300',
        day_hidden: 'invisible',
        root: 'bg-gray-650 rounded-lg border-none',
        ...classNames,
      }}
      components={{
        IconLeft: () => <ArrowLeft className="h-4 w-4" />,
        IconRight: () => <ArrowRight className="h-4 w-4" />,
        Dropdown: ({ value, onChange, children, name }) => {
          const typedChildren = children as ReactElement<{
            value: number;
            children: string;
          }>[];

          const selectedValue = useMemo(
            () =>
              value !== undefined && value !== null
                ? typedChildren.find((child) => child.props.value === value)?.props
                : value,
            [value, typedChildren],
          );

          return (
            <Select
              aria-label={name === 'months' ? 'Current month' : 'Current year'}
              value={typeof value === 'number' ? `${value}` : value}
              onValueChange={(value) =>
                onChange?.({
                  target: { value },
                } as unknown as ChangeEvent<HTMLSelectElement>)
              }
            >
              <SelectTrigger
                className={cn({
                  'h-10 p-2': true,
                  'min-w-[80px]': name === 'months',
                  'min-w-[86px]': name === 'years',
                })}
              >
                <SelectValue>
                  {name === 'months'
                    ? selectedValue?.children.slice(0, 3)
                    : selectedValue?.children}
                </SelectValue>
              </SelectTrigger>
              <SelectContent variant="dark">
                {Children.map(
                  typedChildren,
                  (child) =>
                    !!child?.props && (
                      <SelectItem
                        variant="dark"
                        value={`${child.props.value}`}
                        className={name === 'months' ? 'w-28' : undefined}
                      >
                        {child.props.children}
                      </SelectItem>
                    ),
                )}
              </SelectContent>
            </Select>
          );
        },
        CaptionLabel: (captionLabelProps) =>
          props.captionLayout === 'dropdown' ||
          props.captionLayout === 'dropdown-buttons' ? null : (
            <CaptionLabel {...captionLabelProps} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };

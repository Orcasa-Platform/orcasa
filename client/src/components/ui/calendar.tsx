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
  contentVariants,
} from '@/components/ui/select';

export type CalendarProps = ComponentProps<typeof DayPicker> & VariantProps<typeof contentVariants>;

const calendarDayVariants = cva('text-white hover:bg-blue-500 hover:text-white focus:text-white', {
  variants: {
    variant: {
      default: 'bg-blue-500 focus:bg-blue-500',
      'project-date': 'bg-peach-700 focus:bg-peach-700',
      'dataset-date': 'bg-purple-700 focus:bg-purple-700',
    },
  },
});

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
      className={cn('p-6', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4 w-full',
        caption: 'flex justify-center pb-6 relative items-center',
        caption_label: 'text-sm font-medium',
        caption_dropdowns: 'flex gap-x-4',
        vhidden: 'hidden',
        nav: 'space-x-1 flex items-center',
        nav_button: buttonVariants({ size: 'icon' }),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'mx-auto border-collapse space-y-1',
        head_row: 'flex',
        head_cell: 'text-gray-500 rounded-md w-10 font-normal text-sm',
        row: 'flex w-full mt-2',
        cell: 'h-9 w-10 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-9 w-10 p-0 font-semibold aria-selected:opacity-100 cursor-pointer',
        ),
        day_range_end: 'day-range-end',
        day_selected: calendarDayVariants({ variant }),
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled: 'text-muted-foreground opacity-50',
        day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
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
                variant="date-picker"
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
              <SelectContent variant={variant}>
                {Children.map(
                  typedChildren,
                  (child) =>
                    !!child?.props && (
                      <SelectItem variant={variant} value={`${child.props.value}`}>
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

'use client';

import * as React from 'react';

import * as ScrollArea from '@radix-ui/react-scroll-area';
import * as SelectPrimitive from '@radix-ui/react-select';
import { VariantProps, cva } from 'class-variance-authority';
import { Check, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

export const triggerVariants = cva(
  'flex h-14 w-full items-center justify-between border border-gray-300 bg-transparent p-4 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  [&[data-state=open]>svg]:rotate-180',
  {
    variants: {
      variant: {
        default: '',
        'date-picker': 'data-[state=open]:border-gray-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const contentVariants = cva(
  'relative z-50 min-w-[8rem] overflow-hidden border bg-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'shadow-md',
        'dataset-date': 'border-gray-400',
        'project-date': 'border-gray-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const itemVariants = cva(
  'relative flex cursor-default select-none items-center p-4 pl-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
  {
    variants: {
      variant: {
        default: 'w-[calc(var(--radix-select-trigger-width)-1.25rem)]',
        'project-date': '',
        'dataset-date': '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & {
    error?: boolean;
    'aria-invalid'?: boolean;
  } & VariantProps<typeof triggerVariants>
>(({ className, children, error, 'aria-invalid': ariaInvalid, variant, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      'flex h-14 w-full items-center justify-between border border-gray-300 bg-transparent p-4 text-base ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&[data-state=open]>svg]:rotate-180',
      triggerVariants({ variant }),
      className,
      { 'border-destructive': error || ariaInvalid },
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-6 w-6 transform data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> &
    VariantProps<typeof contentVariants>
>(({ className, children, position = 'popper', variant, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        contentVariants({ variant }),
        {
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1':
            position === 'popper' && variant && !['dataset', 'project'].includes(variant),
          'data-[side=bottom]:-translate-y-px data-[side=left]:translate-x-px data-[side=right]:-translate-x-px data-[side=top]:translate-y-px':
            position === 'popper' && variant && !['dataset', 'project'].includes(variant),
        },
        className,
      )}
      position={position}
      {...props}
    >
      <ScrollArea.Root className="h-full w-full" type="auto">
        <SelectPrimitive.Viewport asChild>
          <ScrollArea.Viewport
            // Remove overflowY to avoid conflicting property https://github.com/radix-ui/primitives/issues/2059#issuecomment-1492071891
            style={{ overflowY: undefined }}
            className={cn(
              'p-1',
              position === 'popper' &&
                'h-full max-h-[50vh] min-h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
            )}
          >
            {children}
          </ScrollArea.Viewport>
        </SelectPrimitive.Viewport>
        <ScrollArea.Scrollbar className="w-4 px-1 py-[5px]" orientation="vertical">
          <ScrollArea.Thumb className="rounded-md bg-black opacity-20" />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn('py-1.5 pl-8 pr-2 text-sm font-semibold', className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & VariantProps<typeof itemVariants>
>(({ className, children, variant, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref} className={cn(itemVariants({ variant }), className)} {...props}>
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};

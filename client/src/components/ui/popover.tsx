'use client';

import * as React from 'react';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const Popover = PopoverPrimitive.Root;
export const PopoverClose = PopoverPrimitive.PopoverClose;

const PopoverTrigger = PopoverPrimitive.Trigger;

const popoverContentVariants = cva(
  'z-50 w-72 rounded-2xl bg-popover p-4 shadow outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'bg-popover',
        dark: 'bg-gray-800 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    VariantProps<typeof popoverContentVariants>
>(({ className, variant, align = 'center', sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(popoverContentVariants({ variant }), className)}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const popoverArrowVariants = cva('', {
  variants: {
    variant: {
      default: 'fill-popover',
      dark: 'fill-gray-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow> &
    VariantProps<typeof popoverArrowVariants>
>(({ className, variant, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn(popoverArrowVariants({ variant: variant }), className)}
    {...props}
  />
));
PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverArrow };

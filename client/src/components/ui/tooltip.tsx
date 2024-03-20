'use client';

import * as React from 'react';

import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const tooltipArrowVariants = cva('', {
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

const TooltipArrow = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Arrow> &
    VariantProps<typeof tooltipArrowVariants>
>(({ className, variant, ...props }, ref) => (
  <TooltipPrimitive.Arrow
    ref={ref}
    className={cn(tooltipArrowVariants({ variant: variant }), className)}
    {...props}
  />
));
TooltipArrow.displayName = TooltipPrimitive.Arrow.displayName;

const tooltipContentVariants = cva(
  'z-50 border shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  {
    variants: {
      variant: {
        default: 'rounded-md bg-popover px-3 py-1.5 text-sm',
        dark: 'rounded backdrop-blur-sm bg-gray-800 border-gray-800 p-2 text-xs text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    VariantProps<typeof tooltipContentVariants>
>(({ className, sideOffset = 4, variant, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(tooltipContentVariants({ variant: variant }), className)}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

const TooltipPortal = TooltipPrimitive.Portal;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipArrow, TooltipPortal };

'use client';

import * as React from 'react';

import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const labelVariants = cva('text-sm leading-none', {
  variants: {
    variant: {
      default: 'peer-disabled:cursor-not-allowed peer-disabled:text-gray-300',
      disabled: 'cursor-not-allowed text-gray-300',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, variant, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants({ variant, className }))} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };

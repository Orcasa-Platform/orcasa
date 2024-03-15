'use client';

import * as React from 'react';

import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return <RadioGroupPrimitive.Root className={cn('grid gap-2', className)} {...props} ref={ref} />;
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const radioGroupItemVariants = cva(
  'rounded-full text-primary ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-300',
  {
    variants: {
      variant: {
        // Regular radio buttons
        default:
          'aspect-square focus:outline-none h-4 w-4 hover:ring-2 hover:ring-green-700 hover:ring-offset-2 disabled:ring-0 border border-gray-200 data-[state=checked]:border-green-700 data-[state=checked]:border-[5px] data-[state=checked]:disabled:border-gray-300',
        // A simple container for custom radio buttons
        naked:
          'rounded-[20px] data-[state=checked]:ring-1 hover:ring-1 hover:ring-gray-200 hover:ring-offset-4 data-[state=checked]:ring-green-700 data-[state=checked]:ring-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-ring',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface RadioGroupItem
  extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>,
    VariantProps<typeof radioGroupItemVariants> {}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItem
>(({ className, variant, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(radioGroupItemVariants({ variant, className }))}
      {...props}
    />
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };

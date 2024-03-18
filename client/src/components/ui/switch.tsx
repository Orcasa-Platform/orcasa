'use client';

import * as React from 'react';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const switchVariants = cva(
  'peer inline-flex h-4 w-7 p-0.5 shrink-0 cursor-pointer items-center rounded-xl py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-150',
  {
    variants: {
      variant: {
        default: ' data-[state=checked]:bg-green-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const thumbVariants = cva(
  'pointer-events-none block h-3 w-3 rounded-full shadow ring-0 transition data-[state=checked]:translate-x-3 data-[state=unchecked]:translate-x-0 bg-white',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchVariants> {}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, variant, ...props }, ref) => (
    <SwitchPrimitives.Root
      className={cn(switchVariants({ variant, className }))}
      {...props}
      ref={ref}
    >
      <SwitchPrimitives.Thumb className={cn(thumbVariants({ variant }))} />
    </SwitchPrimitives.Root>
  ),
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch, switchVariants };

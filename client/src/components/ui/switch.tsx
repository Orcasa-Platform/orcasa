'use client';

import * as React from 'react';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const switchVariants = cva(
  'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-xl border-2 border-slate-700 py-0.5 pl-0.5 pr-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-transparent',
  {
    variants: {
      variant: {
        // Blue switch
        default: 'data-[state=checked]:bg-main',
        // Blue switch that becomes white when toggled
        'two-tone': 'data-[state=checked]:bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const thumbVariants = cva(
  'pointer-events-none block h-4 w-4 rounded-full bg-main shadow ring-0 transition data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
  {
    variants: {
      variant: {
        // Blue switch
        default: 'data-[state=checked]:bg-white',
        // Blue switch that becomes white when toggled
        'two-tone': '',
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

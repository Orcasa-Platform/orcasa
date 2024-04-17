import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-base lg:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:pointer-events-none disabled:opacity-50 font-sans',
  {
    variants: {
      variant: {
        // From the UI kit
        default: 'bg-gray-650 hover:bg-gray-600 rounded-lg',
        primary: 'h-10 text-white rounded-lg bg-green-700 hover:bg-green-800',
        filters: 'h-10 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-gray-700',
        legend: 'bg-gray-700 hover:bg-gray-800 text-white',
        vanilla: '',
        outline: 'border border-gray-300 rounded-lg px-6 py-4 hover:bg-gray-150 text-gray-700',
        'outline-rounded':
          'rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-50 text-gray-700 hover:bg-slate-700 hover:text-white',
        'outline-dark':
          'rounded-lg border border-gray-500 hover:bg-gray-600 text-white hover:text-white focus-visible:ring-offset-gray-700',
        'filter-tag':
          'rounded-2xl border border-yellow-500 bg-gray-700 hover:bg-gray-800 text-yellow-500 focus-visible:ring-offset-gray-700 text-left',
        // Not reviewed yet
        destructive: 'bg-red-500 text-red-500 hover:bg-red-500/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-gray-50 rounded-lg',
        'button-switch': 'text-white !px-2',
        ghost: 'hover:bg-accent hover:text-accent-foreground rounded-lg',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: '!p-0 !h-6',
        'icon-primary':
          'bg-white enabled:hover:bg-green-700 enabled:hover:text-white rounded-lg disabled:opacity-100 disabled:bg-gray-150 disabled:text-gray-300',
        'opener-light':
          'bg-white justify-center items-center flex hover:bg-slate-200 rounded-lg rounded-l-none',
        'opener-dark':
          'text-white bg-gray-700 text-white justify-center items-center flex hover:bg-gray-500 rounded-lg rounded-l-none focus-visible:ring-offset-0',
      },
      size: {
        // From the UI kit
        xs: 'text-xs px-2 py-1',
        'icon-sm': 'h-8 w-8',
        'icon-xs': 'h-6 w-6',
        // Not reviewed yet
        default: 'h-10 px-4 py-0 box-content',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-8 w-8',
        auto: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

import * as React from 'react';

import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/classnames';

const buttonVariants = cva(
  'inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-sans',
  {
    variants: {
      variant: {
        // From the UI kit
        default: 'bg-gray-100 hover:bg-gray-200',
        primary: 'bg-gray-700 hover:bg-gray-800 text-white',
        vanilla: '',
        outline:
          'border border-gray-700 px-4 py-2 hover:bg-gray-50 text-gray-700 hover:bg-slate-700 hover:text-white',
        // Not reviewed yet
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-gray-50',
        'button-switch': 'text-white !px-2',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: '!p-0 !h-6',
        'opener-light': 'bg-white justify-center items-center flex hover:bg-slate-200',
        'opener-dark':
          'bg-slate-700 text-white justify-center items-center flex hover:bg-slate-600',
      },
      size: {
        // From the UI kit
        xs: 'text-xs px-2 py-1',
        'icon-sm': 'h-6 w-6',
        // Not reviewed yet
        default: 'h-10 px-6 py-2 box-content',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
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
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };

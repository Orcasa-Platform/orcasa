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
        primary: 'bg-gray-700 hover:bg-gray-800 text-white',
        vanilla: '',
        // Not reviewed yet
        default: 'border border-blue-400 px-4 py-2 hover:bg-gray-50 text-sky-700',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        'button-switch': 'text-white !px-2',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        icon: '!p-0 !h-6',
        'opener-light':
          'bg-white border-l border-gray-300 justify-center items-center flex hover:bg-slate-200',
        'opener-dark':
          'bg-slate-700 text-white border-l border-gray-300 justify-center items-center flex hover:bg-slate-600',
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
        asChild: '',
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

const SlidingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; text: string }
>(({ className, asChild = false, Icon, text, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';
  return (
    <>
      <Comp className={cn('group flex items-center justify-start', className)} ref={ref} {...props}>
        <Icon className="mr-[15px] h-[34px] w-[34px] bg-gray-100 px-1 py-1 group-hover:bg-slate-700 group-hover:text-white group-focus:bg-slate-700 group-focus:text-white" />
        <span className="-translate-x-1/2 text-xs opacity-0 transition duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-focus:translate-x-0 group-focus:opacity-100">
          {text}
        </span>
      </Comp>
    </>
  );
});

SlidingButton.displayName = 'SlidingButton';

export { Button, SlidingButton, buttonVariants };

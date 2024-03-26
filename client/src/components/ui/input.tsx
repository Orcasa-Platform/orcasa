import * as React from 'react';

import { cn } from '@/lib/classnames';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  error?: boolean;
  'aria-invalid'?: boolean;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, 'aria-invalid': ariaInvalid, ...props }, ref) => {
    return (
      <div className="relative">
        <div className="absolute left-3 top-2">{icon}</div>
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border border-gray-500 bg-gray-700 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-50',
            icon ? 'pl-[44px]' : 'pl-4',
            className,
            { 'border-destructive': error || ariaInvalid },
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };

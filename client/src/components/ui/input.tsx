import * as React from 'react';

import { cn } from '@/lib/classnames';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon?: React.ReactNode;
  containerClassName?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('relative', containerClassName)}>
        <div className="absolute left-4 top-4">{icon}</div>
        <input
          type={type}
          className={cn(
            'flex h-14 w-full border border-gray-300 bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            icon ? 'pl-12' : 'pl-3',
            className,
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

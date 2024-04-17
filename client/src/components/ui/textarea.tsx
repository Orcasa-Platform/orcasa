import * as React from 'react';

import { cn } from '@/lib/classnames';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps & { error: boolean; 'aria-invalid'?: boolean }
>(({ className, error, 'aria-invalid': ariaInvalid, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex min-h-[80px] w-full rounded-lg border border-gray-500 bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 disabled:cursor-not-allowed disabled:opacity-50',
        className,
        { 'border-red-500': error || ariaInvalid },
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };

import { forwardRef } from 'react';

import { cn } from '@/lib/classnames';

const Skeleton = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />
  ),
);

Skeleton.displayName = 'Skeleton';

export { Skeleton };

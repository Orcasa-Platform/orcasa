'use client';

import { PropsWithChildren } from 'react';

import { cn } from '@/lib/classnames';

import { Skeleton } from '@/components/ui/skeleton';

export interface ContentLoaderProps extends PropsWithChildren {
  skeletonClassName?: string;
  data: unknown | undefined;
  isPlaceholderData: boolean;
  isFetching: boolean;
  isFetched: boolean;
  isError: boolean;
}

const ContentLoader = ({
  skeletonClassName,
  children,
  data,
  isPlaceholderData,
  isFetching,
  isFetched,
  isError,
}: ContentLoaderProps) => {
  return (
    <div className="relative">
      {isFetching && !isFetched && <Skeleton className={cn('h-20 w-full', skeletonClassName)} />}
      {isError && isFetched && !isFetching && (
        <p className="py-8 text-center font-semibold text-slate-500">An error occurred</p>
      )}

      {!isPlaceholderData && !isError && isFetched && !!data && children}

      {!isPlaceholderData && !isError && isFetched && !data && (
        <p className="py-8 text-center font-semibold text-slate-500">No data</p>
      )}
    </div>
  );
};

export default ContentLoader;

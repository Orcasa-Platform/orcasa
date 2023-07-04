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

      {/* <Loading
        className="absolute z-10 flex h-full w-full items-center justify-center bg-white/50 py-2"
        iconClassName="w-5 h-5"
        visible={isFetching && !isPlaceholderData}
      /> */}

      {isError && isFetched && !isFetching && 'Error'}

      {!isPlaceholderData && !isError && isFetched && !!data && children}

      {!isPlaceholderData && !isError && isFetched && !data && 'No data'}
    </div>
  );
};

export default ContentLoader;

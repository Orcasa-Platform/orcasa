'use client';

import { useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

import { usePractices } from '@/hooks/practices';

import ContentLoader from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

import Practice from './practice';

export default function PracticeList({
  data,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
  hasNextPage,
  fetchNextPage,
}: ReturnType<typeof usePractices>) {
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  return (
    <ContentLoader
      data={data}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      {!data?.length && (
        <p className="py-8 text-center text-gray-700">No results based on your search criteria</p>
      )}
      <ul>
        {data?.map((g) => {
          return <Practice key={`practice-${g.id}`} {...g} />;
        })}
      </ul>
      {hasNextPage && <Skeleton ref={ref} className="h-[240px] w-full" />}
    </ContentLoader>
  );
}

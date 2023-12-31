import { Fragment, useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

import { DatasetListResponse } from '@/types/datasets';

import { useGetDatasetsInfinite } from '@/hooks/datasets';

import ContentLoader from '@/components/ui/loader';
import { Skeleton } from '@/components/ui/skeleton';

import Dataset from './dataset';

export default function DatasetList({
  data,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
  hasNextPage,
  fetchNextPage,
}: ReturnType<typeof useGetDatasetsInfinite<DatasetListResponse>>) {
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
      {(!data?.pages.length || (data.pages.length === 1 && !data.pages[0].data.length)) && (
        <p className="py-8 text-center text-gray-700">No results based on your search criteria</p>
      )}
      <ul>
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.map((dataset) => (
              <Dataset key={dataset._id} {...dataset} />
            ))}
          </Fragment>
        ))}
      </ul>
      {hasNextPage && <Skeleton ref={ref} className="h-[240px] w-full" />}
    </ContentLoader>
  );
}

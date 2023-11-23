import { Fragment, useEffect } from 'react';

import { useInView } from 'react-intersection-observer';

import { DatasetListResponse } from '@/types/datasets';

import { useGetDatasetsInfinite } from '@/hooks/datasets';

import { Button } from '@/components/ui/button';
import ContentLoader from '@/components/ui/loader';

import Dataset from './dataset';

export default function DatasetList({
  data,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
  hasNextPage,
  isFetchingNextPage,
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
      {!data?.pages.length && (
        <p className="py-8 text-center font-semibold text-slate-500">
          No results based on your search criteria
        </p>
      )}
      {data?.pages.map((page, index) => (
        <Fragment key={index}>
          {page.data.map((dataset) => (
            <Dataset key={dataset._id} {...dataset} />
          ))}
        </Fragment>
      ))}
      <Button
        ref={ref}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
        className="mx-auto mt-8 flex"
      >
        {isFetchingNextPage
          ? 'Loading more...'
          : hasNextPage
          ? 'Load more'
          : 'Nothing more to load'}
      </Button>
    </ContentLoader>
  );
}

import { PracticesFilters } from '@/store/practices';

import { useGetPracticesInfinite } from '@/types/generated/practice';
import { PracticeListResponse } from '@/types/generated/strapi.schemas';

const getQueryFilters = (filters: PracticesFilters) => {
  const generalFilters =
    typeof filters.search !== 'undefined' && filters.search.length > 0
      ? [
          {
            $or: [
              {
                title: {
                  $containsi: filters.search,
                },
              },
              {
                short_description: {
                  $containsi: filters.search,
                },
              },
              // TODO: search the description when it's added in Strapi
              // {
              //   description: {
              //     $containsi: filters.search,
              //   },
              // },
            ],
          },
        ]
      : [];

  return { $and: generalFilters };
};

export const usePractices = ({
  size = 20,
  filters,
}: {
  size?: number;
  filters: PracticesFilters;
}) => {
  const queryFilters = getQueryFilters(filters);

  const getNextPageParam = (lastPage: PracticeListResponse) => {
    const page = lastPage.meta?.pagination?.page ?? 1;
    const pageSize = size;
    const total = lastPage.meta?.pagination?.total ?? Infinity;

    return page * pageSize < total ? page + 1 : undefined;
  };

  const {
    data,
    isFetching,
    isFetched,
    isPlaceholderData,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetPracticesInfinite(
    {
      populate: '*',
      'pagination[pageSize]': size,
      sort: 'title:asc',
      filters: queryFilters,
    },
    {
      query: {
        queryKey: ['practice', filters],
        keepPreviousData: true,
        getNextPageParam,
      },
    },
  );

  return {
    data:
      data?.pages
        .map((page) => page.data ?? [])
        .reduce((res, practices) => [...res, ...practices], []) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetched,
    isPlaceholderData,
    isError,
  };
};

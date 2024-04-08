import {
  GetNextPageParamFunction,
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from '@tanstack/react-query';

import { DatasetsFilters, useDatasetsFilters } from '@/store/datasets';

import { DatasetListResponse, DatasetSource, GetDatasetsParams } from '@/types/datasets';

import API, { ErrorType } from '@/services/api/datasets';

export const getDatasets = (params?: GetDatasetsParams, signal?: AbortSignal) => {
  return API<DatasetListResponse>({ url: `/datasets`, method: 'get', params, signal });
};

export const getGetDatasetsQueryKey = (params?: GetDatasetsParams) =>
  [`/datasets`, ...(params ? [params] : [])] as const;

export const getGetDatasetsInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetsParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData>;
  },
): UseInfiniteQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDatasetsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDatasets>>> = ({ signal, pageParam }) =>
    getDatasets({ page: pageParam, ...params }, signal);

  const getNextPageParam: GetNextPageParamFunction<Awaited<ReturnType<typeof getDatasets>>> = (
    lastPage,
  ) => {
    const page =
      typeof lastPage.meta.page_number === 'undefined'
        ? 1
        : Number.parseInt(lastPage.meta.page_number);
    const pageSize = Number.parseInt(lastPage.meta.page_size);
    const total = lastPage.meta.total_records;

    return page * pageSize < total ? page + 1 : undefined;
  };

  return { queryKey, queryFn, getNextPageParam, ...queryOptions };
};

export const useGetDatasetsInfinite = <
  TData = Awaited<ReturnType<typeof getDatasets>>,
  TError = ErrorType<Error>,
>(
  params?: GetDatasetsParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getDatasets>>, TError, TData>;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetDatasetsInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const useDatasetsFiltersOptions = (): Record<
  keyof Pick<DatasetsFilters, 'source'>,
  { label: string; value: string }[]
> => {
  return {
    source: [
      { label: 'Cirad dataverse', value: DatasetSource.Cirad },
      { label: 'Harvard dataverse', value: DatasetSource.Harvard },
      { label: 'Inrae dataverse', value: DatasetSource.Inrae },
      { label: 'Joint Research Centre Data Catalogue', value: DatasetSource.JRC },
      { label: 'Zenodo', value: DatasetSource.Zenodo },
    ],
  };
};

export const useDatasetsActiveFilters = () => {
  const filtersOptions = useDatasetsFiltersOptions();
  const [filters] = useDatasetsFilters();

  return Object.entries(filters)
    .map(([key, value]: [string, unknown | unknown[]]) => {
      const options = filtersOptions[key as keyof typeof filtersOptions];

      // If all the options of a filter are active, it's the same as if the filter is not applied,
      // so we ignore it
      if (!options || (Array.isArray(value) && options.length === value.length)) {
        return [];
      }

      if (Array.isArray(value)) {
        return value
          .map((filterValue) => {
            const option = options?.find(({ value }) => value === filterValue);
            if (option) {
              return {
                filter: key,
                label: option.label,
                value: option.value,
              };
            }
          })
          .filter((filter) => filter?.value !== undefined && filter?.value !== null) as {
          filter: string;
          label: string;
          value: string;
        }[];
      } else {
        const option = options?.find((option) => option.value === value);
        if (!option) {
          return [];
        }

        return [
          {
            filter: key,
            label: option.label,
            value,
          },
        ];
      }
    })
    .flat();
};

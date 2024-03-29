/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseInfiniteQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  UseInfiniteQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import type {
  PracticeListResponse,
  Error,
  GetPracticesParams,
  PracticeResponse,
  PracticeRequest,
  GetPracticesIdParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getPractices = (params?: GetPracticesParams, signal?: AbortSignal) => {
  return API<PracticeListResponse>({ url: `/practices`, method: 'get', params, signal });
};

export const getGetPracticesQueryKey = (params?: GetPracticesParams) =>
  [`/practices`, ...(params ? [params] : [])] as const;

export const getGetPracticesInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getPractices>>,
  TError = ErrorType<Error>,
>(
  params?: GetPracticesParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getPractices>>, TError, TData>;
  },
): UseInfiniteQueryOptions<Awaited<ReturnType<typeof getPractices>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetPracticesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPractices>>> = ({
    signal,
    pageParam,
  }) => getPractices({ 'pagination[page]': pageParam, ...params }, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetPracticesInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getPractices>>>;
export type GetPracticesInfiniteQueryError = ErrorType<Error>;

export const useGetPracticesInfinite = <
  TData = Awaited<ReturnType<typeof getPractices>>,
  TError = ErrorType<Error>,
>(
  params?: GetPracticesParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getPractices>>, TError, TData>;
  },
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetPracticesInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getGetPracticesQueryOptions = <
  TData = Awaited<ReturnType<typeof getPractices>>,
  TError = ErrorType<Error>,
>(
  params?: GetPracticesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getPractices>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<typeof getPractices>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetPracticesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPractices>>> = ({ signal }) =>
    getPractices(params, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetPracticesQueryResult = NonNullable<Awaited<ReturnType<typeof getPractices>>>;
export type GetPracticesQueryError = ErrorType<Error>;

export const useGetPractices = <
  TData = Awaited<ReturnType<typeof getPractices>>,
  TError = ErrorType<Error>,
>(
  params?: GetPracticesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getPractices>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetPracticesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postPractices = (practiceRequest: PracticeRequest) => {
  return API<PracticeResponse>({
    url: `/practices`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: practiceRequest,
  });
};

export const getPostPracticesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postPractices>>,
    TError,
    { data: PracticeRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postPractices>>,
  TError,
  { data: PracticeRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postPractices>>,
    { data: PracticeRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postPractices(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostPracticesMutationResult = NonNullable<Awaited<ReturnType<typeof postPractices>>>;
export type PostPracticesMutationBody = PracticeRequest;
export type PostPracticesMutationError = ErrorType<Error>;

export const usePostPractices = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postPractices>>,
    TError,
    { data: PracticeRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostPracticesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getPracticesId = (id: number, params?: GetPracticesIdParams, signal?: AbortSignal) => {
  return API<PracticeResponse>({ url: `/practices/${id}`, method: 'get', params, signal });
};

export const getGetPracticesIdQueryKey = (id: number, params?: GetPracticesIdParams) =>
  [`/practices/${id}`, ...(params ? [params] : [])] as const;

export const getGetPracticesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getPracticesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetPracticesIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getPracticesId>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<typeof getPracticesId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetPracticesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPracticesId>>> = ({ signal }) =>
    getPracticesId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions };
};

export type GetPracticesIdQueryResult = NonNullable<Awaited<ReturnType<typeof getPracticesId>>>;
export type GetPracticesIdQueryError = ErrorType<Error>;

export const useGetPracticesId = <
  TData = Awaited<ReturnType<typeof getPracticesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetPracticesIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getPracticesId>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetPracticesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putPracticesId = (id: number, practiceRequest: PracticeRequest) => {
  return API<PracticeResponse>({
    url: `/practices/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: practiceRequest,
  });
};

export const getPutPracticesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putPracticesId>>,
    TError,
    { id: number; data: PracticeRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putPracticesId>>,
  TError,
  { id: number; data: PracticeRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putPracticesId>>,
    { id: number; data: PracticeRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putPracticesId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutPracticesIdMutationResult = NonNullable<Awaited<ReturnType<typeof putPracticesId>>>;
export type PutPracticesIdMutationBody = PracticeRequest;
export type PutPracticesIdMutationError = ErrorType<Error>;

export const usePutPracticesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putPracticesId>>,
    TError,
    { id: number; data: PracticeRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutPracticesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deletePracticesId = (id: number) => {
  return API<number>({ url: `/practices/${id}`, method: 'delete' });
};

export const getDeletePracticesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deletePracticesId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deletePracticesId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deletePracticesId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deletePracticesId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeletePracticesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deletePracticesId>>
>;

export type DeletePracticesIdMutationError = ErrorType<Error>;

export const useDeletePracticesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deletePracticesId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeletePracticesIdMutationOptions(options);

  return useMutation(mutationOptions);
};

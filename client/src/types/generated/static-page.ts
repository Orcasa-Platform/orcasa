/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * DOCUMENTATION
 * OpenAPI spec version: 1.0.0
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import type {
  StaticPageListResponse,
  Error,
  GetStaticPagesParams,
  StaticPageResponse,
  StaticPageRequest,
  GetStaticPagesIdParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getStaticPages = (params?: GetStaticPagesParams, signal?: AbortSignal) => {
  return API<StaticPageListResponse>({ url: `/static-pages`, method: 'get', params, signal });
};

export const getGetStaticPagesQueryKey = (params?: GetStaticPagesParams) =>
  [`/static-pages`, ...(params ? [params] : [])] as const;

export const getGetStaticPagesQueryOptions = <
  TData = Awaited<ReturnType<typeof getStaticPages>>,
  TError = ErrorType<Error>,
>(
  params?: GetStaticPagesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getStaticPages>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<typeof getStaticPages>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetStaticPagesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getStaticPages>>> = ({ signal }) =>
    getStaticPages(params, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetStaticPagesQueryResult = NonNullable<Awaited<ReturnType<typeof getStaticPages>>>;
export type GetStaticPagesQueryError = ErrorType<Error>;

export const useGetStaticPages = <
  TData = Awaited<ReturnType<typeof getStaticPages>>,
  TError = ErrorType<Error>,
>(
  params?: GetStaticPagesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getStaticPages>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetStaticPagesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postStaticPages = (staticPageRequest: StaticPageRequest) => {
  return API<StaticPageResponse>({
    url: `/static-pages`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: staticPageRequest,
  });
};

export const getPostStaticPagesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postStaticPages>>,
    TError,
    { data: StaticPageRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postStaticPages>>,
  TError,
  { data: StaticPageRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postStaticPages>>,
    { data: StaticPageRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postStaticPages(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostStaticPagesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postStaticPages>>
>;
export type PostStaticPagesMutationBody = StaticPageRequest;
export type PostStaticPagesMutationError = ErrorType<Error>;

export const usePostStaticPages = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postStaticPages>>,
    TError,
    { data: StaticPageRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostStaticPagesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getStaticPagesId = (
  id: number,
  params?: GetStaticPagesIdParams,
  signal?: AbortSignal,
) => {
  return API<StaticPageResponse>({ url: `/static-pages/${id}`, method: 'get', params, signal });
};

export const getGetStaticPagesIdQueryKey = (id: number, params?: GetStaticPagesIdParams) =>
  [`/static-pages/${id}`, ...(params ? [params] : [])] as const;

export const getGetStaticPagesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getStaticPagesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetStaticPagesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStaticPagesId>>, TError, TData>;
  },
): UseQueryOptions<Awaited<ReturnType<typeof getStaticPagesId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetStaticPagesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getStaticPagesId>>> = ({ signal }) =>
    getStaticPagesId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions };
};

export type GetStaticPagesIdQueryResult = NonNullable<Awaited<ReturnType<typeof getStaticPagesId>>>;
export type GetStaticPagesIdQueryError = ErrorType<Error>;

export const useGetStaticPagesId = <
  TData = Awaited<ReturnType<typeof getStaticPagesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetStaticPagesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStaticPagesId>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetStaticPagesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putStaticPagesId = (id: number, staticPageRequest: StaticPageRequest) => {
  return API<StaticPageResponse>({
    url: `/static-pages/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: staticPageRequest,
  });
};

export const getPutStaticPagesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putStaticPagesId>>,
    TError,
    { id: number; data: StaticPageRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putStaticPagesId>>,
  TError,
  { id: number; data: StaticPageRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putStaticPagesId>>,
    { id: number; data: StaticPageRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putStaticPagesId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutStaticPagesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putStaticPagesId>>
>;
export type PutStaticPagesIdMutationBody = StaticPageRequest;
export type PutStaticPagesIdMutationError = ErrorType<Error>;

export const usePutStaticPagesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putStaticPagesId>>,
    TError,
    { id: number; data: StaticPageRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutStaticPagesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteStaticPagesId = (id: number) => {
  return API<number>({ url: `/static-pages/${id}`, method: 'delete' });
};

export const getDeleteStaticPagesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteStaticPagesId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteStaticPagesId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteStaticPagesId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteStaticPagesId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteStaticPagesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteStaticPagesId>>
>;

export type DeleteStaticPagesIdMutationError = ErrorType<Error>;

export const useDeleteStaticPagesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteStaticPagesId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteStaticPagesIdMutationOptions(options);

  return useMutation(mutationOptions);
};

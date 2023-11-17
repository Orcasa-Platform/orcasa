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
  RegionListResponse,
  Error,
  GetRegionsParams,
  RegionResponse,
  RegionRequest,
  GetRegionsIdParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getRegions = (params?: GetRegionsParams, signal?: AbortSignal) => {
  return API<RegionListResponse>({ url: `/regions`, method: 'get', params, signal });
};

export const getGetRegionsQueryKey = (params?: GetRegionsParams) =>
  [`/regions`, ...(params ? [params] : [])] as const;

export const getGetRegionsQueryOptions = <
  TData = Awaited<ReturnType<typeof getRegions>>,
  TError = ErrorType<Error>,
>(
  params?: GetRegionsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getRegions>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<typeof getRegions>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetRegionsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getRegions>>> = ({ signal }) =>
    getRegions(params, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetRegionsQueryResult = NonNullable<Awaited<ReturnType<typeof getRegions>>>;
export type GetRegionsQueryError = ErrorType<Error>;

export const useGetRegions = <
  TData = Awaited<ReturnType<typeof getRegions>>,
  TError = ErrorType<Error>,
>(
  params?: GetRegionsParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getRegions>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetRegionsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postRegions = (regionRequest: RegionRequest) => {
  return API<RegionResponse>({
    url: `/regions`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: regionRequest,
  });
};

export const getPostRegionsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postRegions>>,
    TError,
    { data: RegionRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postRegions>>,
  TError,
  { data: RegionRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postRegions>>,
    { data: RegionRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postRegions(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostRegionsMutationResult = NonNullable<Awaited<ReturnType<typeof postRegions>>>;
export type PostRegionsMutationBody = RegionRequest;
export type PostRegionsMutationError = ErrorType<Error>;

export const usePostRegions = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postRegions>>,
    TError,
    { data: RegionRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostRegionsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getRegionsId = (id: number, params?: GetRegionsIdParams, signal?: AbortSignal) => {
  return API<RegionResponse>({ url: `/regions/${id}`, method: 'get', params, signal });
};

export const getGetRegionsIdQueryKey = (id: number, params?: GetRegionsIdParams) =>
  [`/regions/${id}`, ...(params ? [params] : [])] as const;

export const getGetRegionsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getRegionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetRegionsIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getRegionsId>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<typeof getRegionsId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetRegionsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getRegionsId>>> = ({ signal }) =>
    getRegionsId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions };
};

export type GetRegionsIdQueryResult = NonNullable<Awaited<ReturnType<typeof getRegionsId>>>;
export type GetRegionsIdQueryError = ErrorType<Error>;

export const useGetRegionsId = <
  TData = Awaited<ReturnType<typeof getRegionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetRegionsIdParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getRegionsId>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetRegionsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putRegionsId = (id: number, regionRequest: RegionRequest) => {
  return API<RegionResponse>({
    url: `/regions/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: regionRequest,
  });
};

export const getPutRegionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putRegionsId>>,
    TError,
    { id: number; data: RegionRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putRegionsId>>,
  TError,
  { id: number; data: RegionRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putRegionsId>>,
    { id: number; data: RegionRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putRegionsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutRegionsIdMutationResult = NonNullable<Awaited<ReturnType<typeof putRegionsId>>>;
export type PutRegionsIdMutationBody = RegionRequest;
export type PutRegionsIdMutationError = ErrorType<Error>;

export const usePutRegionsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putRegionsId>>,
    TError,
    { id: number; data: RegionRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutRegionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteRegionsId = (id: number) => {
  return API<number>({ url: `/regions/${id}`, method: 'delete' });
};

export const getDeleteRegionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteRegionsId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteRegionsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteRegionsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteRegionsId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteRegionsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteRegionsId>>
>;

export type DeleteRegionsIdMutationError = ErrorType<Error>;

export const useDeleteRegionsId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteRegionsId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteRegionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};

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
  AreaOfInterventionListResponse,
  Error,
  GetAreaOfInterventionsParams,
  AreaOfInterventionResponse,
  AreaOfInterventionRequest,
  GetAreaOfInterventionsIdParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getAreaOfInterventions = (
  params?: GetAreaOfInterventionsParams,
  signal?: AbortSignal,
) => {
  return API<AreaOfInterventionListResponse>({
    url: `/area-of-interventions`,
    method: 'get',
    params,
    signal,
  });
};

export const getGetAreaOfInterventionsQueryKey = (params?: GetAreaOfInterventionsParams) =>
  [`/area-of-interventions`, ...(params ? [params] : [])] as const;

export const getGetAreaOfInterventionsQueryOptions = <
  TData = Awaited<ReturnType<typeof getAreaOfInterventions>>,
  TError = ErrorType<Error>,
>(
  params?: GetAreaOfInterventionsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAreaOfInterventions>>, TError, TData>;
  },
): UseQueryOptions<Awaited<ReturnType<typeof getAreaOfInterventions>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAreaOfInterventionsQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAreaOfInterventions>>> = ({ signal }) =>
    getAreaOfInterventions(params, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetAreaOfInterventionsQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAreaOfInterventions>>
>;
export type GetAreaOfInterventionsQueryError = ErrorType<Error>;

export const useGetAreaOfInterventions = <
  TData = Awaited<ReturnType<typeof getAreaOfInterventions>>,
  TError = ErrorType<Error>,
>(
  params?: GetAreaOfInterventionsParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAreaOfInterventions>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetAreaOfInterventionsQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postAreaOfInterventions = (areaOfInterventionRequest: AreaOfInterventionRequest) => {
  return API<AreaOfInterventionResponse>({
    url: `/area-of-interventions`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: areaOfInterventionRequest,
  });
};

export const getPostAreaOfInterventionsMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAreaOfInterventions>>,
    TError,
    { data: AreaOfInterventionRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postAreaOfInterventions>>,
  TError,
  { data: AreaOfInterventionRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postAreaOfInterventions>>,
    { data: AreaOfInterventionRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postAreaOfInterventions(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostAreaOfInterventionsMutationResult = NonNullable<
  Awaited<ReturnType<typeof postAreaOfInterventions>>
>;
export type PostAreaOfInterventionsMutationBody = AreaOfInterventionRequest;
export type PostAreaOfInterventionsMutationError = ErrorType<Error>;

export const usePostAreaOfInterventions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postAreaOfInterventions>>,
    TError,
    { data: AreaOfInterventionRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostAreaOfInterventionsMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getAreaOfInterventionsId = (
  id: number,
  params?: GetAreaOfInterventionsIdParams,
  signal?: AbortSignal,
) => {
  return API<AreaOfInterventionResponse>({
    url: `/area-of-interventions/${id}`,
    method: 'get',
    params,
    signal,
  });
};

export const getGetAreaOfInterventionsIdQueryKey = (
  id: number,
  params?: GetAreaOfInterventionsIdParams,
) => [`/area-of-interventions/${id}`, ...(params ? [params] : [])] as const;

export const getGetAreaOfInterventionsIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getAreaOfInterventionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetAreaOfInterventionsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAreaOfInterventionsId>>, TError, TData>;
  },
): UseQueryOptions<Awaited<ReturnType<typeof getAreaOfInterventionsId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAreaOfInterventionsIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAreaOfInterventionsId>>> = ({
    signal,
  }) => getAreaOfInterventionsId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions };
};

export type GetAreaOfInterventionsIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getAreaOfInterventionsId>>
>;
export type GetAreaOfInterventionsIdQueryError = ErrorType<Error>;

export const useGetAreaOfInterventionsId = <
  TData = Awaited<ReturnType<typeof getAreaOfInterventionsId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetAreaOfInterventionsIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAreaOfInterventionsId>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetAreaOfInterventionsIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putAreaOfInterventionsId = (
  id: number,
  areaOfInterventionRequest: AreaOfInterventionRequest,
) => {
  return API<AreaOfInterventionResponse>({
    url: `/area-of-interventions/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: areaOfInterventionRequest,
  });
};

export const getPutAreaOfInterventionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putAreaOfInterventionsId>>,
    TError,
    { id: number; data: AreaOfInterventionRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putAreaOfInterventionsId>>,
  TError,
  { id: number; data: AreaOfInterventionRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putAreaOfInterventionsId>>,
    { id: number; data: AreaOfInterventionRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putAreaOfInterventionsId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutAreaOfInterventionsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putAreaOfInterventionsId>>
>;
export type PutAreaOfInterventionsIdMutationBody = AreaOfInterventionRequest;
export type PutAreaOfInterventionsIdMutationError = ErrorType<Error>;

export const usePutAreaOfInterventionsId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putAreaOfInterventionsId>>,
    TError,
    { id: number; data: AreaOfInterventionRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutAreaOfInterventionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteAreaOfInterventionsId = (id: number) => {
  return API<number>({ url: `/area-of-interventions/${id}`, method: 'delete' });
};

export const getDeleteAreaOfInterventionsIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAreaOfInterventionsId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteAreaOfInterventionsId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteAreaOfInterventionsId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteAreaOfInterventionsId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteAreaOfInterventionsIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteAreaOfInterventionsId>>
>;

export type DeleteAreaOfInterventionsIdMutationError = ErrorType<Error>;

export const useDeleteAreaOfInterventionsId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteAreaOfInterventionsId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteAreaOfInterventionsIdMutationOptions(options);

  return useMutation(mutationOptions);
};

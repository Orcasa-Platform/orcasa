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
  OrganizationThemeListResponse,
  Error,
  GetOrganizationThemesParams,
  OrganizationThemeResponse,
  OrganizationThemeRequest,
  GetOrganizationThemesIdParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getOrganizationThemes = (
  params?: GetOrganizationThemesParams,
  signal?: AbortSignal,
) => {
  return API<OrganizationThemeListResponse>({
    url: `/organization-themes`,
    method: 'get',
    params,
    signal,
  });
};

export const getGetOrganizationThemesQueryKey = (params?: GetOrganizationThemesParams) =>
  [`/organization-themes`, ...(params ? [params] : [])] as const;

export const getGetOrganizationThemesQueryOptions = <
  TData = Awaited<ReturnType<typeof getOrganizationThemes>>,
  TError = ErrorType<Error>,
>(
  params?: GetOrganizationThemesParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationThemes>>, TError, TData>;
  },
): UseQueryOptions<Awaited<ReturnType<typeof getOrganizationThemes>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetOrganizationThemesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getOrganizationThemes>>> = ({ signal }) =>
    getOrganizationThemes(params, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetOrganizationThemesQueryResult = NonNullable<
  Awaited<ReturnType<typeof getOrganizationThemes>>
>;
export type GetOrganizationThemesQueryError = ErrorType<Error>;

export const useGetOrganizationThemes = <
  TData = Awaited<ReturnType<typeof getOrganizationThemes>>,
  TError = ErrorType<Error>,
>(
  params?: GetOrganizationThemesParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationThemes>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetOrganizationThemesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postOrganizationThemes = (organizationThemeRequest: OrganizationThemeRequest) => {
  return API<OrganizationThemeResponse>({
    url: `/organization-themes`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: organizationThemeRequest,
  });
};

export const getPostOrganizationThemesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postOrganizationThemes>>,
    TError,
    { data: OrganizationThemeRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postOrganizationThemes>>,
  TError,
  { data: OrganizationThemeRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postOrganizationThemes>>,
    { data: OrganizationThemeRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postOrganizationThemes(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostOrganizationThemesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postOrganizationThemes>>
>;
export type PostOrganizationThemesMutationBody = OrganizationThemeRequest;
export type PostOrganizationThemesMutationError = ErrorType<Error>;

export const usePostOrganizationThemes = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postOrganizationThemes>>,
    TError,
    { data: OrganizationThemeRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostOrganizationThemesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getOrganizationThemesId = (
  id: number,
  params?: GetOrganizationThemesIdParams,
  signal?: AbortSignal,
) => {
  return API<OrganizationThemeResponse>({
    url: `/organization-themes/${id}`,
    method: 'get',
    params,
    signal,
  });
};

export const getGetOrganizationThemesIdQueryKey = (
  id: number,
  params?: GetOrganizationThemesIdParams,
) => [`/organization-themes/${id}`, ...(params ? [params] : [])] as const;

export const getGetOrganizationThemesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getOrganizationThemesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetOrganizationThemesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationThemesId>>, TError, TData>;
  },
): UseQueryOptions<Awaited<ReturnType<typeof getOrganizationThemesId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetOrganizationThemesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getOrganizationThemesId>>> = ({
    signal,
  }) => getOrganizationThemesId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions };
};

export type GetOrganizationThemesIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getOrganizationThemesId>>
>;
export type GetOrganizationThemesIdQueryError = ErrorType<Error>;

export const useGetOrganizationThemesId = <
  TData = Awaited<ReturnType<typeof getOrganizationThemesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetOrganizationThemesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrganizationThemesId>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetOrganizationThemesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putOrganizationThemesId = (
  id: number,
  organizationThemeRequest: OrganizationThemeRequest,
) => {
  return API<OrganizationThemeResponse>({
    url: `/organization-themes/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: organizationThemeRequest,
  });
};

export const getPutOrganizationThemesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putOrganizationThemesId>>,
    TError,
    { id: number; data: OrganizationThemeRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putOrganizationThemesId>>,
  TError,
  { id: number; data: OrganizationThemeRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putOrganizationThemesId>>,
    { id: number; data: OrganizationThemeRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putOrganizationThemesId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutOrganizationThemesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putOrganizationThemesId>>
>;
export type PutOrganizationThemesIdMutationBody = OrganizationThemeRequest;
export type PutOrganizationThemesIdMutationError = ErrorType<Error>;

export const usePutOrganizationThemesId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putOrganizationThemesId>>,
    TError,
    { id: number; data: OrganizationThemeRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutOrganizationThemesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteOrganizationThemesId = (id: number) => {
  return API<number>({ url: `/organization-themes/${id}`, method: 'delete' });
};

export const getDeleteOrganizationThemesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteOrganizationThemesId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteOrganizationThemesId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteOrganizationThemesId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteOrganizationThemesId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteOrganizationThemesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteOrganizationThemesId>>
>;

export type DeleteOrganizationThemesIdMutationError = ErrorType<Error>;

export const useDeleteOrganizationThemesId = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteOrganizationThemesId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteOrganizationThemesIdMutationOptions(options);

  return useMutation(mutationOptions);
};

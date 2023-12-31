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
  ProjectTypeListResponse,
  Error,
  GetProjectTypesParams,
  ProjectTypeResponse,
  ProjectTypeRequest,
  GetProjectTypesIdParams,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getProjectTypes = (params?: GetProjectTypesParams, signal?: AbortSignal) => {
  return API<ProjectTypeListResponse>({ url: `/project-types`, method: 'get', params, signal });
};

export const getGetProjectTypesQueryKey = (params?: GetProjectTypesParams) =>
  [`/project-types`, ...(params ? [params] : [])] as const;

export const getGetProjectTypesQueryOptions = <
  TData = Awaited<ReturnType<typeof getProjectTypes>>,
  TError = ErrorType<Error>,
>(
  params?: GetProjectTypesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getProjectTypes>>, TError, TData> },
): UseQueryOptions<Awaited<ReturnType<typeof getProjectTypes>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetProjectTypesQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getProjectTypes>>> = ({ signal }) =>
    getProjectTypes(params, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetProjectTypesQueryResult = NonNullable<Awaited<ReturnType<typeof getProjectTypes>>>;
export type GetProjectTypesQueryError = ErrorType<Error>;

export const useGetProjectTypes = <
  TData = Awaited<ReturnType<typeof getProjectTypes>>,
  TError = ErrorType<Error>,
>(
  params?: GetProjectTypesParams,
  options?: { query?: UseQueryOptions<Awaited<ReturnType<typeof getProjectTypes>>, TError, TData> },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetProjectTypesQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postProjectTypes = (projectTypeRequest: ProjectTypeRequest) => {
  return API<ProjectTypeResponse>({
    url: `/project-types`,
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: projectTypeRequest,
  });
};

export const getPostProjectTypesMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProjectTypes>>,
    TError,
    { data: ProjectTypeRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postProjectTypes>>,
  TError,
  { data: ProjectTypeRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postProjectTypes>>,
    { data: ProjectTypeRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postProjectTypes(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostProjectTypesMutationResult = NonNullable<
  Awaited<ReturnType<typeof postProjectTypes>>
>;
export type PostProjectTypesMutationBody = ProjectTypeRequest;
export type PostProjectTypesMutationError = ErrorType<Error>;

export const usePostProjectTypes = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postProjectTypes>>,
    TError,
    { data: ProjectTypeRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPostProjectTypesMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getProjectTypesId = (
  id: number,
  params?: GetProjectTypesIdParams,
  signal?: AbortSignal,
) => {
  return API<ProjectTypeResponse>({ url: `/project-types/${id}`, method: 'get', params, signal });
};

export const getGetProjectTypesIdQueryKey = (id: number, params?: GetProjectTypesIdParams) =>
  [`/project-types/${id}`, ...(params ? [params] : [])] as const;

export const getGetProjectTypesIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getProjectTypesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetProjectTypesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProjectTypesId>>, TError, TData>;
  },
): UseQueryOptions<Awaited<ReturnType<typeof getProjectTypesId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetProjectTypesIdQueryKey(id, params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getProjectTypesId>>> = ({ signal }) =>
    getProjectTypesId(id, params, signal);

  return { queryKey, queryFn, enabled: !!id, ...queryOptions };
};

export type GetProjectTypesIdQueryResult = NonNullable<
  Awaited<ReturnType<typeof getProjectTypesId>>
>;
export type GetProjectTypesIdQueryError = ErrorType<Error>;

export const useGetProjectTypesId = <
  TData = Awaited<ReturnType<typeof getProjectTypesId>>,
  TError = ErrorType<Error>,
>(
  id: number,
  params?: GetProjectTypesIdParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getProjectTypesId>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetProjectTypesIdQueryOptions(id, params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putProjectTypesId = (id: number, projectTypeRequest: ProjectTypeRequest) => {
  return API<ProjectTypeResponse>({
    url: `/project-types/${id}`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: projectTypeRequest,
  });
};

export const getPutProjectTypesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putProjectTypesId>>,
    TError,
    { id: number; data: ProjectTypeRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putProjectTypesId>>,
  TError,
  { id: number; data: ProjectTypeRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putProjectTypesId>>,
    { id: number; data: ProjectTypeRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putProjectTypesId(id, data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutProjectTypesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof putProjectTypesId>>
>;
export type PutProjectTypesIdMutationBody = ProjectTypeRequest;
export type PutProjectTypesIdMutationError = ErrorType<Error>;

export const usePutProjectTypesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putProjectTypesId>>,
    TError,
    { id: number; data: ProjectTypeRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutProjectTypesIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteProjectTypesId = (id: number) => {
  return API<number>({ url: `/project-types/${id}`, method: 'delete' });
};

export const getDeleteProjectTypesIdMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteProjectTypesId>>,
    TError,
    { id: number },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteProjectTypesId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteProjectTypesId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteProjectTypesId(id);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteProjectTypesIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteProjectTypesId>>
>;

export type DeleteProjectTypesIdMutationError = ErrorType<Error>;

export const useDeleteProjectTypesId = <TError = ErrorType<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteProjectTypesId>>,
    TError,
    { id: number },
    TContext
  >;
}) => {
  const mutationOptions = getDeleteProjectTypesIdMutationOptions(options);

  return useMutation(mutationOptions);
};

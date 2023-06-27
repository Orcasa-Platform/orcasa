/**
 * Generated by orval v6.16.0 🍺
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
import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

import type {
  MetadatumListResponse,
  Error,
  GetMetadataParams,
  MetadatumResponse,
  MetadatumRequest,
} from './strapi.schemas';

export const getMetadata = (
  params?: GetMetadataParams,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<MetadatumListResponse>> => {
  return axios.get(`/metadata`, {
    ...options,
    params: { ...params, ...options?.params },
  });
};

export const getGetMetadataQueryKey = (params?: GetMetadataParams) =>
  [`/metadata`, ...(params ? [params] : [])] as const;

export const getGetMetadataInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getMetadata>>,
  TError = AxiosError<Error>
>(
  params?: GetMetadataParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getMetadata>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseInfiniteQueryOptions<Awaited<ReturnType<typeof getMetadata>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMetadataQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMetadata>>> = ({ signal, pageParam }) =>
    getMetadata({ nextId: pageParam, ...params }, { signal, ...axiosOptions });

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions };
};

export type GetMetadataInfiniteQueryResult = NonNullable<Awaited<ReturnType<typeof getMetadata>>>;
export type GetMetadataInfiniteQueryError = AxiosError<Error>;

export const useGetMetadataInfinite = <
  TData = Awaited<ReturnType<typeof getMetadata>>,
  TError = AxiosError<Error>
>(
  params?: GetMetadataParams,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getMetadata>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMetadataInfiniteQueryOptions(params, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getGetMetadataQueryOptions = <
  TData = Awaited<ReturnType<typeof getMetadata>>,
  TError = AxiosError<Error>
>(
  params?: GetMetadataParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMetadata>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseQueryOptions<Awaited<ReturnType<typeof getMetadata>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMetadataQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMetadata>>> = ({ signal }) =>
    getMetadata(params, { signal, ...axiosOptions });

  return { queryKey, queryFn, staleTime: 10000, ...queryOptions };
};

export type GetMetadataQueryResult = NonNullable<Awaited<ReturnType<typeof getMetadata>>>;
export type GetMetadataQueryError = AxiosError<Error>;

export const useGetMetadata = <
  TData = Awaited<ReturnType<typeof getMetadata>>,
  TError = AxiosError<Error>
>(
  params?: GetMetadataParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMetadata>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMetadataQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const postMetadata = (
  metadatumRequest: MetadatumRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<MetadatumResponse>> => {
  return axios.post(`/metadata`, metadatumRequest, options);
};

export const getPostMetadataMutationOptions = <
  TError = AxiosError<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postMetadata>>,
    TError,
    { data: MetadatumRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof postMetadata>>,
  TError,
  { data: MetadatumRequest },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof postMetadata>>,
    { data: MetadatumRequest }
  > = (props) => {
    const { data } = props ?? {};

    return postMetadata(data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PostMetadataMutationResult = NonNullable<Awaited<ReturnType<typeof postMetadata>>>;
export type PostMetadataMutationBody = MetadatumRequest;
export type PostMetadataMutationError = AxiosError<Error>;

export const usePostMetadata = <TError = AxiosError<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof postMetadata>>,
    TError,
    { data: MetadatumRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPostMetadataMutationOptions(options);

  return useMutation(mutationOptions);
};
export const getMetadataId = (
  id: number,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<MetadatumResponse>> => {
  return axios.get(`/metadata/${id}`, options);
};

export const getGetMetadataIdQueryKey = (id: number) => [`/metadata/${id}`] as const;

export const getGetMetadataIdInfiniteQueryOptions = <
  TData = Awaited<ReturnType<typeof getMetadataId>>,
  TError = AxiosError<Error>
>(
  id: number,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getMetadataId>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseInfiniteQueryOptions<Awaited<ReturnType<typeof getMetadataId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMetadataIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMetadataId>>> = ({ signal }) =>
    getMetadataId(id, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!id, staleTime: 10000, ...queryOptions };
};

export type GetMetadataIdInfiniteQueryResult = NonNullable<
  Awaited<ReturnType<typeof getMetadataId>>
>;
export type GetMetadataIdInfiniteQueryError = AxiosError<Error>;

export const useGetMetadataIdInfinite = <
  TData = Awaited<ReturnType<typeof getMetadataId>>,
  TError = AxiosError<Error>
>(
  id: number,
  options?: {
    query?: UseInfiniteQueryOptions<Awaited<ReturnType<typeof getMetadataId>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMetadataIdInfiniteQueryOptions(id, options);

  const query = useInfiniteQuery(queryOptions) as UseInfiniteQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const getGetMetadataIdQueryOptions = <
  TData = Awaited<ReturnType<typeof getMetadataId>>,
  TError = AxiosError<Error>
>(
  id: number,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMetadataId>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseQueryOptions<Awaited<ReturnType<typeof getMetadataId>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions, axios: axiosOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetMetadataIdQueryKey(id);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getMetadataId>>> = ({ signal }) =>
    getMetadataId(id, { signal, ...axiosOptions });

  return { queryKey, queryFn, enabled: !!id, staleTime: 10000, ...queryOptions };
};

export type GetMetadataIdQueryResult = NonNullable<Awaited<ReturnType<typeof getMetadataId>>>;
export type GetMetadataIdQueryError = AxiosError<Error>;

export const useGetMetadataId = <
  TData = Awaited<ReturnType<typeof getMetadataId>>,
  TError = AxiosError<Error>
>(
  id: number,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMetadataId>>, TError, TData>;
    axios?: AxiosRequestConfig;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetMetadataIdQueryOptions(id, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putMetadataId = (
  id: number,
  metadatumRequest: MetadatumRequest,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<MetadatumResponse>> => {
  return axios.put(`/metadata/${id}`, metadatumRequest, options);
};

export const getPutMetadataIdMutationOptions = <
  TError = AxiosError<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putMetadataId>>,
    TError,
    { id: number; data: MetadatumRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putMetadataId>>,
  TError,
  { id: number; data: MetadatumRequest },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putMetadataId>>,
    { id: number; data: MetadatumRequest }
  > = (props) => {
    const { id, data } = props ?? {};

    return putMetadataId(id, data, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutMetadataIdMutationResult = NonNullable<Awaited<ReturnType<typeof putMetadataId>>>;
export type PutMetadataIdMutationBody = MetadatumRequest;
export type PutMetadataIdMutationError = AxiosError<Error>;

export const usePutMetadataId = <TError = AxiosError<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putMetadataId>>,
    TError,
    { id: number; data: MetadatumRequest },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getPutMetadataIdMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteMetadataId = (
  id: number,
  options?: AxiosRequestConfig
): Promise<AxiosResponse<number>> => {
  return axios.delete(`/metadata/${id}`, options);
};

export const getDeleteMetadataIdMutationOptions = <
  TError = AxiosError<Error>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteMetadataId>>,
    TError,
    { id: number },
    TContext
  >;
  axios?: AxiosRequestConfig;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteMetadataId>>,
  TError,
  { id: number },
  TContext
> => {
  const { mutation: mutationOptions, axios: axiosOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteMetadataId>>,
    { id: number }
  > = (props) => {
    const { id } = props ?? {};

    return deleteMetadataId(id, axiosOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteMetadataIdMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteMetadataId>>
>;

export type DeleteMetadataIdMutationError = AxiosError<Error>;

export const useDeleteMetadataId = <TError = AxiosError<Error>, TContext = unknown>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteMetadataId>>,
    TError,
    { id: number },
    TContext
  >;
  axios?: AxiosRequestConfig;
}) => {
  const mutationOptions = getDeleteMetadataIdMutationOptions(options);

  return useMutation(mutationOptions);
};

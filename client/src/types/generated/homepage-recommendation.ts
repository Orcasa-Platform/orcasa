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
  HomepageRecommendationResponse,
  Error,
  GetHomepageRecommendationParams,
  HomepageRecommendationRequest,
} from './strapi.schemas';
import { API } from '../../services/api/index';
import type { ErrorType } from '../../services/api/index';

export const getHomepageRecommendation = (
  params?: GetHomepageRecommendationParams,
  signal?: AbortSignal,
) => {
  return API<HomepageRecommendationResponse>({
    url: `/homepage-recommendation`,
    method: 'get',
    params,
    signal,
  });
};

export const getGetHomepageRecommendationQueryKey = (params?: GetHomepageRecommendationParams) =>
  [`/homepage-recommendation`, ...(params ? [params] : [])] as const;

export const getGetHomepageRecommendationQueryOptions = <
  TData = Awaited<ReturnType<typeof getHomepageRecommendation>>,
  TError = ErrorType<Error>,
>(
  params?: GetHomepageRecommendationParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHomepageRecommendation>>, TError, TData>;
  },
): UseQueryOptions<Awaited<ReturnType<typeof getHomepageRecommendation>>, TError, TData> & {
  queryKey: QueryKey;
} => {
  const { query: queryOptions } = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetHomepageRecommendationQueryKey(params);

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getHomepageRecommendation>>> = ({
    signal,
  }) => getHomepageRecommendation(params, signal);

  return { queryKey, queryFn, ...queryOptions };
};

export type GetHomepageRecommendationQueryResult = NonNullable<
  Awaited<ReturnType<typeof getHomepageRecommendation>>
>;
export type GetHomepageRecommendationQueryError = ErrorType<Error>;

export const useGetHomepageRecommendation = <
  TData = Awaited<ReturnType<typeof getHomepageRecommendation>>,
  TError = ErrorType<Error>,
>(
  params?: GetHomepageRecommendationParams,
  options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHomepageRecommendation>>, TError, TData>;
  },
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions = getGetHomepageRecommendationQueryOptions(params, options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
};

export const putHomepageRecommendation = (
  homepageRecommendationRequest: HomepageRecommendationRequest,
) => {
  return API<HomepageRecommendationResponse>({
    url: `/homepage-recommendation`,
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    data: homepageRecommendationRequest,
  });
};

export const getPutHomepageRecommendationMutationOptions = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putHomepageRecommendation>>,
    TError,
    { data: HomepageRecommendationRequest },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof putHomepageRecommendation>>,
  TError,
  { data: HomepageRecommendationRequest },
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof putHomepageRecommendation>>,
    { data: HomepageRecommendationRequest }
  > = (props) => {
    const { data } = props ?? {};

    return putHomepageRecommendation(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type PutHomepageRecommendationMutationResult = NonNullable<
  Awaited<ReturnType<typeof putHomepageRecommendation>>
>;
export type PutHomepageRecommendationMutationBody = HomepageRecommendationRequest;
export type PutHomepageRecommendationMutationError = ErrorType<Error>;

export const usePutHomepageRecommendation = <
  TError = ErrorType<Error>,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof putHomepageRecommendation>>,
    TError,
    { data: HomepageRecommendationRequest },
    TContext
  >;
}) => {
  const mutationOptions = getPutHomepageRecommendationMutationOptions(options);

  return useMutation(mutationOptions);
};
export const deleteHomepageRecommendation = () => {
  return API<number>({ url: `/homepage-recommendation`, method: 'delete' });
};

export const getDeleteHomepageRecommendationMutationOptions = <
  TError = ErrorType<Error>,
  TVariables = void,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteHomepageRecommendation>>,
    TError,
    TVariables,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof deleteHomepageRecommendation>>,
  TError,
  TVariables,
  TContext
> => {
  const { mutation: mutationOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof deleteHomepageRecommendation>>,
    TVariables
  > = () => {
    return deleteHomepageRecommendation();
  };

  return { mutationFn, ...mutationOptions };
};

export type DeleteHomepageRecommendationMutationResult = NonNullable<
  Awaited<ReturnType<typeof deleteHomepageRecommendation>>
>;

export type DeleteHomepageRecommendationMutationError = ErrorType<Error>;

export const useDeleteHomepageRecommendation = <
  TError = ErrorType<Error>,
  TVariables = void,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof deleteHomepageRecommendation>>,
    TError,
    TVariables,
    TContext
  >;
}) => {
  const mutationOptions = getDeleteHomepageRecommendationMutationOptions(options);

  return useMutation(mutationOptions);
};

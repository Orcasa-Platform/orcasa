import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

import env from '@/env.mjs';

export const AXIOS_INSTANCE = Axios.create({
  baseURL: env.NEXT_PUBLIC_SCIENTIFIC_EVIDENCE_STATS_API_URL,
});

export const ScientificEvidenceStatsAPI = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = Axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token })
    .then(({ data }) => data)
    .catch((error: AxiosError) => {
      if (Axios.isAxiosError(error)) {
        console.error(
          'Axios error: Please check NEXT_PUBLIC_SCIENTIFIC_EVIDENCE_STATS_API_URL env variable',
          error,
        );
      }
    });

  config.signal?.addEventListener?.('abort', () => {
    source.cancel('Query was cancelled by React Query');
  });

  return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export default ScientificEvidenceStatsAPI;

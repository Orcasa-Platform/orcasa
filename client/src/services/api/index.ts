import env from '@/env.mjs';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

 export const AXIOS_INSTANCE = Axios.create({ baseURL: env.NEXT_PUBLIC_API_URL });

 export const API = <T>(config: AxiosRequestConfig): Promise<T> => {
   const source = Axios.CancelToken.source();
   const promise = AXIOS_INSTANCE({ ...config, cancelToken: source.token }).then(
     ({ data }) => data,
   );

   // @ts-ignore
   promise.cancel = () => {
     source.cancel('Query was cancelled by React Query');
   };

   return promise;
 };

 // In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
 export type ErrorType<Error> = AxiosError<Error>;

 export default API;
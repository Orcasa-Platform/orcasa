'use client';

import { useCallback } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { BrowserInterface, RecoilURLSyncOptions } from 'recoil-sync';

type UseSyncURLNextOptions = {
  decodedQueryParams?: boolean;
};

export function useSyncURLNext(
  options: UseSyncURLNextOptions
): Partial<Omit<RecoilURLSyncOptions, 'children'>> {
  const { decodedQueryParams } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    // replace,
    push,
  } = useRouter();

  const browserInterface: BrowserInterface = {
    replaceURL: useCallback(
      (url: string) => {
        const u = decodedQueryParams ? decodeURIComponent(url) : url;
        return window.history.replaceState({}, '', u);
        // return replace(u, { shallow: true });
      },
      [decodedQueryParams]
    ),

    pushURL: useCallback(
      (url: string) => {
        const u = decodedQueryParams ? decodeURIComponent(url) : url;
        return push(u, { shallow: true });
      },
      [decodedQueryParams, push]
    ),

    getURL: useCallback(() => {
      const url = new URL(
        `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`,
        globalThis?.document?.location?.href ?? 'http://localhost:3000'
      );

      return url.toString();
    }, [pathname, searchParams]),

    listenChangeURL: useCallback((handler2: () => void) => {
      return () => {
        handler2();
      };
    }, []),
  };

  return {
    browserInterface,
  };
}

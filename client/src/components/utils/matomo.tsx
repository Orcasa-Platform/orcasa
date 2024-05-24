'use client';

import { useState, useEffect } from 'react';

import { usePathname, useSearchParams } from 'next/navigation';

import { init, push } from '@socialgouv/matomo-next';

import env from '@/env.mjs';

const Matomo = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [initialised, setInitialised] = useState(false);

  // Initialize Matomo
  useEffect(() => {
    if (env.NEXT_PUBLIC_MATOMO_URL && env.NEXT_PUBLIC_MATOMO_SITE_ID && !initialised) {
      init({ url: env.NEXT_PUBLIC_MATOMO_URL, siteId: env.NEXT_PUBLIC_MATOMO_SITE_ID });
    }

    return () => setInitialised(true);
  }, [initialised, setInitialised]);

  // Send page views
  useEffect(() => {
    if (!pathname) return;

    const url = pathname + (searchParams ? '?' + searchParams.toString() : '');

    push(['setCustomUrl', url]);
    push(['trackPageView']);
  }, [pathname, searchParams]);

  return null;
};

export default Matomo;

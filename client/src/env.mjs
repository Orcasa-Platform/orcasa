// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NEXT_USE_RESTRICTIVE_ROBOTS_TXT: z.enum(['true', 'false']).optional(),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get typeerrors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']).optional(),
    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_DATASETS_API_URL: z.string().url(),
    NEXT_PUBLIC_SCIENTIFIC_EVIDENCE_STATS_API_URL: z.string().url(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
    NEXT_PUBLIC_MATOMO_SITE_ID: z.string().optional(),
    NEXT_PUBLIC_MATOMO_URL: z.string().optional(),
    NEXT_PUBLIC_MAPBOX_TOKEN: z.string(),
    NEXT_PUBLIC_SURVEY_URL: z.string().optional(),
    NEXT_PUBLIC_SURVEY_DIALOG_EXPANDED_UNTIL: z
      .string()
      .refine((value) => {
        if (value === '') return true;

        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(value);
      })
      .optional(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get typeerrors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DATASETS_API_URL: process.env.NEXT_PUBLIC_DATASETS_API_URL,
    NEXT_PUBLIC_SCIENTIFIC_EVIDENCE_STATS_API_URL:
      process.env.NEXT_PUBLIC_SCIENTIFIC_EVIDENCE_STATS_API_URL,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    NEXT_PUBLIC_MATOMO_SITE_ID: process.env.NEXT_PUBLIC_MATOMO_SITE_ID,
    NEXT_PUBLIC_MATOMO_URL: process.env.NEXT_PUBLIC_MATOMO_URL,
    NEXT_USE_RESTRICTIVE_ROBOTS_TXT: process.env.NEXT_USE_RESTRICTIVE_ROBOTS_TXT,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    NEXT_PUBLIC_SURVEY_URL: process.env.NEXT_PUBLIC_SURVEY_URL,
    NEXT_PUBLIC_SURVEY_DIALOG_EXPANDED_UNTIL: process.env.NEXT_PUBLIC_SURVEY_DIALOG_EXPANDED_UNTIL,
  },
});

export default env;

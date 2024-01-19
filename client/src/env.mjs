// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {},
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
    NEXT_PUBLIC_NETWORK_SUGGESTION_EMAIL_RECIPIENTS: z.string(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
    NEXT_PUBLIC_HIDE_NETWORK_FORMS: z.string().optional(),
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
    NEXT_PUBLIC_NETWORK_SUGGESTION_EMAIL_RECIPIENTS:
      process.env.NEXT_PUBLIC_NETWORK_SUGGESTION_EMAIL_RECIPIENTS,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    NEXT_PUBLIC_HIDE_NETWORK_FORMS: process.env.NEXT_PUBLIC_HIDE_NETWORK_FORMS,
  },
});

export default env;

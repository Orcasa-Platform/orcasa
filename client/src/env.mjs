// @ts-check
import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const castToBoolean = (/** @type {unknown} */ value) => {
  if (value === 'true') {
    return true;
  }

  return false;
};

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: z.preprocess(castToBoolean, z.boolean()),
  },
  /*
   * Environment variables available on the client (and server).
   *
   * 💡 You'll get typeerrors if these are not prefixed with NEXT_PUBLIC_.
   */
  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production']),
    NEXT_PUBLIC_URL: z.string().url(),
    NEXT_PUBLIC_API_URL: z.string().url(),
    NEXT_PUBLIC_MAPBOX_API_TOKEN: z.string(),
    NEXT_PUBLIC_GA_TRACKING_ID: z.string().optional(),
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
    NEXT_PUBLIC_MAPBOX_API_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN,
    NEXT_PUBLIC_GA_TRACKING_ID: process.env.NEXT_PUBLIC_GA_TRACKING_ID,
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED:
      process.env.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED,
  },
});

export default env;

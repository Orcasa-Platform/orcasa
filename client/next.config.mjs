import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@orcasa/types'],
  images: {
    domains: ['api.mapbox.com'],
  },
  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
  },
};

export default nextConfig;

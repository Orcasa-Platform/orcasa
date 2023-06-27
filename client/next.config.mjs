import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@serverless-app-scaffold/types'],
  images: {
    domains: ['api.mapbox.com'],
  },
};

export default nextConfig;

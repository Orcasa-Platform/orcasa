import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.mapbox.com'],
  },
}

export default nextConfig;

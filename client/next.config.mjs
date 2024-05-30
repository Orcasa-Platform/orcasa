import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
  transpilePackages: ['@orcasa/types'],
  webpack(config) {
    // Match xxx.svg?unoptimized files and load them without any svgo optimization
    config.module.rules.push({
      test: /\.svg$/,
      resourceQuery: /unoptimized/,
      use: [{ loader: '@svgr/webpack', options: { svgo: false } }],
    });

    // Match any other .svg files
    config.module.rules.push({
      test: /\.svg$/,
      resourceQuery: { not: [/unoptimized/] },
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

export default nextConfig;

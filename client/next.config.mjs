import('./src/env.mjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@orcasa/types'],
  env: {
    RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED: 'false',
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: 'svg-sprite-loader',
        },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              {
                name: 'preset-default',
                params: {
                  overrides: {
                    convertColors: { shorthex: false },
                    convertPathData: false,
                  },
                },
              },
            ],
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;

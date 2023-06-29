import env from '@/env.mjs';

export const MAPBOX_STYLES = {
  default:
    env.NEXT_PUBLIC_ENVIRONMENT === 'production'
      ? 'mapbox://styles/layer-manager/clj8fgofm000t01pjcu21agsd?fresh=true'
      : 'mapbox://styles/layer-manager/clj8fgofm000t01pjcu21agsd?fresh=true',
};

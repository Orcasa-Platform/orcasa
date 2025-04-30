export interface Module {
  name: string;
  slug: string;
  href: string;
  // Video link for the module tutorial.
  videoHref?: string;
  // Links to an external website through redirect. Specific to Scientific Evidence module.
  external?: boolean;
}

export const modules = [
  {
    name: 'Geospatial data',
    slug: 'geospatial-data',
    href: '/geospatial-data',
    videoHref: 'https://vimeo.com/1060782020',
  },
  {
    name: 'Scientific evidence',
    slug: 'scientific-evidence',
    href: '/scientific-evidence',
    videoHref: 'https://vimeo.com/1060783373',
    external: true,
  },
  {
    name: 'Practices',
    slug: 'practices',
    href: '/practices',
    videoHref: 'https://vimeo.com/1060783048',
  },
  {
    name: 'Network',
    slug: 'network',
    href: '/network',
    videoHref: 'https://vimeo.com/1060782630',
  },
  {
    name: 'Datasets',
    slug: 'datasets',
    href: '/datasets',
    videoHref: 'https://vimeo.com/1060780286',
  },
] as const satisfies readonly Module[];

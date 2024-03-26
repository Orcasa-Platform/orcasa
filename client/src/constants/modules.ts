export interface Module {
  name: string;
  slug: string;
  href: string;
  // Links to an external website through redirect. Specific to Scientific Evidence module.
  external?: boolean;
}

export const modules = [
  {
    name: 'Geospatial data',
    slug: 'geospatial-data',
    href: '/geospatial-data',
  },
  {
    name: 'Scientific evidence',
    slug: 'scientific-evidence',
    href: '/scientific-evidence',
    external: true,
  },
  {
    name: 'Practices',
    slug: 'practices',
    href: '/practices',
  },
  {
    name: 'Network',
    slug: 'network',
    href: '/network',
  },
  {
    name: 'Datasets',
    slug: 'datasets',
    href: '/datasets',
  },
] as const satisfies readonly Module[];

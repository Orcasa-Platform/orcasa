export const moduleColors = {
  brown: {
    background: 'bg-brown-500',
    border: 'border-brown-500',
    hoverBorder: 'hover:border-brown-500',
  },
  yellow: {
    background: 'bg-yellow-500',
    border: 'border-yellow-500',
    hoverBorder: 'hover:border-yellow-500',
  },
  teal: {
    background: 'bg-teal-500',
    border: 'border-teal-500',
    hoverBorder: 'hover:border-teal-500',
  },
  blue: {
    background: 'bg-blue-500',
    border: 'border-blue-500',
    hoverBorder: 'hover:border-blue-500',
  },
  purple: {
    background: 'bg-purple-700',
    border: 'border-purple-700',
    hoverBorder: 'hover:border-purple-700',
  },
};

export interface Module {
  name: string;
  slug: string;
  href: string;
  color: keyof typeof moduleColors;
  // Links to an external website through redirect. Specific to Scientific Evidence module.
  external?: boolean;
}

export const modules = [
  {
    name: 'Geospatial Data',
    slug: 'geospatial-data',
    href: '/geospatial-data',
    color: 'yellow',
  },
  {
    name: 'Scientific Evidence',
    slug: 'scientific-evidence',
    href: '/scientific-evidence',
    color: 'teal',
    external: true,
  },
  {
    name: 'Practices',
    slug: 'practices',
    href: '/practices',
    color: 'brown',
  },
  {
    name: 'Network',
    slug: 'network',
    href: '/network',
    color: 'blue',
  },
  {
    name: 'Datasets',
    slug: 'datasets',
    href: '/datasets',
    color: 'purple',
  },
] as const satisfies readonly Module[];

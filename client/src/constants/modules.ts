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
  disabled: boolean; // NOTE: temporal. Remove when all the modules are ready
}

export const modules = [
  {
    name: 'Geospatial Data',
    slug: 'geospatial-data',
    href: '/geospatial-data',
    color: 'yellow',
    disabled: false,
  },
  {
    name: 'Scientific Evidence',
    slug: 'scientific-evidence',
    // NOTE: temporal URL
    href: 'http://ns3192284.ip-5-39-73.eu/scientific_evidence/',
    color: 'teal',
    disabled: false,
  },
  {
    name: 'Practices',
    slug: 'practices',
    href: '/practices',
    color: 'brown',
    disabled: true,
  },
  {
    name: 'Network',
    slug: 'network',
    href: '/network',
    color: 'blue',
    disabled: false,
  },
  {
    name: 'Datasets',
    slug: 'datasets',
    href: '/datasets',
    color: 'purple',
    disabled: false,
  },
] as const satisfies readonly Module[];

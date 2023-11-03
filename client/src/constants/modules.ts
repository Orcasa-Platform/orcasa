export const moduleColors = {
  brown: {
    background: 'bg-brown-500',
    border: 'border-brown-500',
  },
  yellow: {
    background: 'bg-yellow-500',
    border: 'border-yellow-500',
  },
  teal: {
    background: 'bg-teal-500',
    border: 'border-teal-500',
  },
  blue: {
    background: 'bg-blue-500',
    border: 'border-blue-500',
  },
  purple: {
    background: 'bg-purple-700',
    border: 'border-purple-700',
  },
};

export interface Module {
  name: string;
  href: string;
  color: keyof typeof moduleColors;
}

export const modules = [
  {
    name: 'Geospatial Data',
    href: '/geospatial-data',
    color: 'yellow',
  },
  {
    name: 'Scientific Evidence',
    href: '/scientific-evidence',
    color: 'teal',
  },
  {
    name: 'Practices',
    href: '/practices',
    color: 'brown',
  },
  {
    name: 'Network',
    href: '/network',
    color: 'blue',
  },
  {
    name: 'Datasets',
    href: '/datasets',
    color: 'purple',
  },
] as const satisfies readonly Module[];

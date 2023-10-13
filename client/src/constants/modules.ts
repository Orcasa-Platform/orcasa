export const moduleColors = {
  'dark-yellow': {
    background: 'bg-yellow-600',
    border: 'border-yellow-600',
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
  indigo: {
    background: 'bg-indigo-500',
    border: 'border-indigo-500',
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
    color: 'dark-yellow',
  },
  {
    name: 'Network',
    href: '/network',
    color: 'blue',
  },
  {
    name: 'Datasets',
    href: '/datasets',
    color: 'indigo',
  },
] as const satisfies readonly Module[];

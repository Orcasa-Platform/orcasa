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
  openNewTab?: boolean;
  color: keyof typeof moduleColors;
  disabled: boolean; // NOTE: temporal. Remove when all the modules are ready
}

export const modules = [
  {
    name: 'Geospatial Data',
    href: '/geospatial-data',
    color: 'yellow',
    disabled: false,
  },
  {
    name: 'Scientific Evidence',
    // NOTE: temporal URL
    href: 'http://ns3192284.ip-5-39-73.eu/scientific_evidence/',
    color: 'teal',
    disabled: false,
  },
  {
    name: 'Practices',
    href: '/practices',
    color: 'brown',
    disabled: true,
  },
  {
    name: 'Network',
    href: '/network',
    color: 'blue',
    disabled: false,
  },
  {
    name: 'Datasets',
    // NOTE: temporal URL
    href: 'http://orcasa.ekoal.org/',
    openNewTab: true,
    color: 'purple',
    disabled: true,
  },
] as const satisfies readonly Module[];

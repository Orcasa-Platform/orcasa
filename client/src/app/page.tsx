/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import logo from 'public/images/logo.svg';

import { cn } from '@/lib/classnames';

interface Link {
  href: string;
  color: string;
  text: string;
}

const backgroundColors: { [key: string]: string } = {
  'dark-yellow': 'bg-yellow-600',
  yellow: 'bg-yellow-400',
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
};

const links: Link[] = [
  {
    href: '/map-layers',
    color: 'yellow',
    text: 'Map Layers',
  },
  {
    href: '/scientific-evidence',
    color: 'teal',
    text: 'Scientific Evidence',
  },
  {
    href: '/practices',
    color: 'dark-yellow',
    text: 'Practices',
  },
  {
    href: '/network',
    color: 'blue',
    text: 'Network',
  },
  {
    href: '/datasets',
    color: 'indigo',
    text: 'Datasets',
  },
];

const LinkBox = ({ href, color, text }: Link) => (
  <Link
    href={href}
    className={cn(
      'relative flex h-[279px] w-[308px] items-center justify-center',
      backgroundColors[color],
    )}
  >
    <div className="text-center text-[40px] font-bold text-white">{text}</div>
  </Link>
);

export default async function HomePage() {
  return (
    <div className="h-screen w-screen bg-indigo-950/80">
      <img src={logo.src} alt="logo" className={`h-[${logo.height}-px] w-[${logo.height}-px]`} />
      <div className="w-[640px] text-7xl font-semibold leading-[80px] text-white">
        The Soil Carbon One-Stop Hub for Climate Action
      </div>
      <div className="flex">
        {links.map((link) => (
          <LinkBox key={link.href} {...link} />
        ))}
      </div>
      ;
    </div>
  );
}

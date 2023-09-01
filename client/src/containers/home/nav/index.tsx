/* eslint-disable @next/next/no-img-element */
'use client';
import { usePathname } from 'next/navigation';

import logo from 'public/images/logo.svg';

import { cn } from '@/lib/classnames';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  color: string;
  active?: boolean;
}

const borderColors: { [key: string]: string } = {
  'dark-yellow': 'border-yellow-600',
  yellow: 'border-yellow-400',
  teal: 'border-teal-500',
  blue: 'border-blue-500',
  indigo: 'border-indigo-500',
};

const Link = ({ href, children, color, active }: LinkProps) => (
  <a
    href={href}
    className={cn(
      'flex h-[68px] cursor-pointer items-center justify-start border-l-8 py-4 pl-6 pr-4 font-sans text-sm font-semibold leading-tight transition-colors duration-200 hover:bg-white hover:text-slate-700',
      borderColors[color],
      {
        'bg-white': active,
        'text-slate-700': active,
        'bg-slate-700': !active,
        'text-white': !active,
      },
    )}
  >
    {children}
  </a>
);

export default function Nav() {
  const pathname = usePathname();
  const links = [
    {
      href: '/',
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

  return (
    <div className="absolute left-0 z-50 h-full w-[117px]">
      <div className="flex h-full w-full flex-col items-center justify-start gap-20 bg-slate-700 py-6">
        <img src={logo.src} alt="logo" className={`h-[${logo.height}-px] w-[${logo.height}-px]`} />
        <div className="flex flex-col gap-px bg-slate-600 py-px">
          {links.map((link) => {
            const { href, color, text } = link;
            return (
              <Link key={href} href={href} color={color} active={pathname === href}>
                {text}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

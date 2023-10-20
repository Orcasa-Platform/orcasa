/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import Logo from 'public/images/logo.svg';

import { cn } from '@/lib/classnames';

import { Module, moduleColors, modules } from '@/constants/modules';

import Icon from '@/components/ui/icon';

const LinkBox = ({ href, color, name }: Module) => (
  <Link
    href={href}
    className={cn(
      'relative flex h-[279px] w-[308px] items-center justify-center',
      moduleColors[color].background,
    )}
  >
    <div className="text-center text-[40px] font-bold text-white">{name}</div>
  </Link>
);

export default async function HomePage() {
  return (
    <div className="h-screen w-screen bg-indigo-950/80">
      <Link href="/">
        <Icon icon={Logo} className="h-[68px] w-[69px]" />
        <span className="sr-only">ORCaSa</span>
      </Link>
      <div className="flex h-[75%] items-center gap-4 p-10">
        {modules.map((module) => (
          <LinkBox key={module.href} {...module} />
        ))}
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/classnames';

import { Module, moduleColors, modules } from '@/constants/modules';

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
    <div className="h-screen w-screen bg-gray-800">
      <Link href="/">
        <Image src="/images/logo.png" width={58} height={58} alt="Impact4Soil" />
        <span className="sr-only">Impact4Soil</span>
      </Link>
      <div className="flex h-[75%] items-center gap-4 p-10">
        {modules.map((module) => (
          <LinkBox key={module.href} {...module} />
        ))}
      </div>
    </div>
  );
}

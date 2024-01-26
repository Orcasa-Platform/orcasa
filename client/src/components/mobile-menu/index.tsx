'use client';

import Link from 'next/link';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X, ExternalLink } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useMobileMenu } from '@/store';

import { modules, moduleColors } from '@/constants/modules';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useMobileMenu();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  if (!isOpen) return null;
  return (
    <>
      <DialogPrimitive.Content className="absolute left-0 top-0 z-50 h-screen w-screen transform bg-gray-700 text-white animate-in slide-in-from-right-full">
        <DialogPrimitive.Close onClick={toggleMenu} className="absolute right-4 top-4">
          <X className="h-6 w-6 text-white" />
        </DialogPrimitive.Close>
        <nav className="flex h-full w-screen flex-col items-center justify-center gap-10 font-serif text-lg">
          {modules.map((module) => {
            const { href, name, color } = module;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'box-border flex items-center border-b-4 pb-2',
                  moduleColors[color].border,
                )}
                onClick={() => setIsOpen(false)}
              >
                {name}
              </Link>
            );
          })}
          <a
            key="about-link"
            href="/#about"
            className="ml-2 w-[calc(100%_-_20px)]"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex w-full justify-center border-t border-dashed border-gray-500 py-10">
              About the project
              <ExternalLink className="ml-4 inline h-6 w-6" />
            </div>
          </a>
        </nav>
      </DialogPrimitive.Content>
    </>
  );
};

export default MobileMenu;

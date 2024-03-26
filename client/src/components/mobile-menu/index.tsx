'use client';

import Link from 'next/link';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

import { useMobileMenu } from '@/store';

import { modules } from '@/constants/modules';

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
            const { href, name } = module;
            return (
              <Link
                key={href}
                href={href}
                className="box-border flex items-center border-b-4 border-transparent pb-2 transition-colors hover:border-yellow-500"
                onClick={() => setIsOpen(false)}
              >
                {name}
              </Link>
            );
          })}
          <div className="flex w-[calc(100%_-_20px)] justify-center border-t border-gray-600 py-10">
            <a
              key="about-link"
              href="/#about"
              className="box-border flex items-center border-b-4 border-transparent pb-2 transition-colors hover:border-yellow-500"
              onClick={() => setIsOpen(false)}
            >
              About
            </a>
          </div>
        </nav>
      </DialogPrimitive.Content>
    </>
  );
};

export default MobileMenu;

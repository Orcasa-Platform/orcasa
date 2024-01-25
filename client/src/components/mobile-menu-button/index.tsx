'use client';

import { Menu } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useMobileMenu } from '@/store';
type MobileMenuButtonProps = {
  theme?: 'dark' | 'light';
};
const MobileMenuButton = ({ theme = 'light' }: MobileMenuButtonProps) => {
  const [, setMobileMenu] = useMobileMenu();
  return (
    <button type="button" className="lg:hidden" onClick={() => setMobileMenu(true)}>
      <span className="sr-only">Open menu</span>
      <Menu
        className={cn('h-6 w-6', {
          'text-gray-700': theme === 'light',
          'text-gray-100': theme === 'dark',
        })}
      />
    </button>
  );
};

export default MobileMenuButton;

'use client';

import { Menu } from 'lucide-react';

import { useMobileMenu } from '@/store';

import { DialogTrigger } from '@/components/ui/dialog';

const MobileMenuButton = () => {
  const [, setMobileMenu] = useMobileMenu();
  return (
    <DialogTrigger asChild>
      <button type="button" className="lg:hidden" onClick={() => setMobileMenu(true)}>
        <span className="sr-only">Open menu</span>
        <Menu className="h-6 w-6 text-white" />
      </button>
    </DialogTrigger>
  );
};

export default MobileMenuButton;

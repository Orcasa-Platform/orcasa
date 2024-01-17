'use client';

import { cn } from '@/lib/classnames';

import { useMobileMenu } from '@/store';
type MobileMenuButtonProps = {
  theme?: 'dark' | 'light';
};
const MobileMenuButton = ({ theme = 'light' }: MobileMenuButtonProps) => {
  const [, setMobileMenu] = useMobileMenu();
  const hamburguerSlice = (
    <div
      className={cn('not-sr-only h-[2.5px] w-6 rounded-sm', {
        'bg-gray-700': theme === 'light',
        'bg-gray-100': theme === 'dark',
      })}
    />
  );
  return (
    <button type="button" className="space-y-1.5 lg:hidden" onClick={() => setMobileMenu(true)}>
      <span className="sr-only">Open menu</span>
      {hamburguerSlice}
      {hamburguerSlice}
      {hamburguerSlice}
    </button>
  );
};

export default MobileMenuButton;

'use client';

import { FC, useState } from 'react';

import { X } from 'lucide-react';
import Settings from 'public/images/settings.svg';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';

import { CONTROL_BUTTON_STYLES } from '../constants';

import type { SettingsControlProps } from './types';

export const SettingsControl: FC<SettingsControlProps> = ({
  className,
  children,
}: SettingsControlProps) => {
  const [open, setOpen] = useState(false);
  const renderButton = (
    <button
      className={cn({
        [CONTROL_BUTTON_STYLES.default]: true,
        [CONTROL_BUTTON_STYLES.hover]: true,
        [CONTROL_BUTTON_STYLES.active]: open,
        [CONTROL_BUTTON_STYLES.focus]: true,
        [CONTROL_BUTTON_STYLES.disabled]: true,
      })}
      aria-label="Map settings"
      type="button"
    >
      <Settings className="h-5 w-5" />
    </button>
  );

  const renderPopoverContent = (isMobile = false) => {
    return isMobile ? (
      <div className="p-4">{children}</div>
    ) : (
      <>
        {children}
        <PopoverClose asChild>
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            className="absolute right-3 top-3"
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
      </>
    );
  };

  return (
    <>
      {/* Mobile */}
      <Drawer>
        <DrawerTrigger className="block lg:hidden">{renderButton}</DrawerTrigger>
        <DrawerContent>{renderPopoverContent(true)}</DrawerContent>
      </Drawer>
      {/* Rest */}
      <div className={cn('hidden flex-col space-y-0.5 lg:flex', className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>{renderButton}</PopoverTrigger>
          <PopoverContent side="left" align="start" className="w-[240px] p-6" sideOffset={16}>
            {renderPopoverContent()}
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default SettingsControl;

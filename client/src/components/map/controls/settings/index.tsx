'use client';

import { FC } from 'react';

import { TooltipPortal } from '@radix-ui/react-tooltip';
import { Settings, X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { CONTROL_BUTTON_STYLES } from '../constants';

import type { SettingsControlProps } from './types';

export const SettingsControl: FC<SettingsControlProps> = ({
  className,
  children,
}: SettingsControlProps) => {
  return (
    <div className={cn('flex flex-col space-y-0.5', className)}>
      <Popover>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <button
                className={cn({
                  [CONTROL_BUTTON_STYLES.default]: true,
                  [CONTROL_BUTTON_STYLES.hover]: true,
                  [CONTROL_BUTTON_STYLES.active]: true,
                })}
                aria-label="Map style"
                type="button"
              >
                <Settings className="h-[20px] w-[20px]" />
              </button>
            </TooltipTrigger>
          </PopoverTrigger>

          <TooltipPortal>
            <TooltipContent side="left" align="center">
              <div className="font-serif text-2xs">Map settings</div>
              <TooltipArrow className="fill-white" width={10} height={5} />
            </TooltipContent>
          </TooltipPortal>

          <PopoverContent side="left" align="start" className="w-[240px] p-6" sideOffset={16}>
            {children}
            <PopoverClose asChild>
              <Button
                type="button"
                size="icon-sm"
                className="absolute right-3 top-3 rounded-lg bg-gray-50"
              >
                <span className="sr-only">Close</span>
                <X className="h-4 w-4" />
              </Button>
            </PopoverClose>
          </PopoverContent>
        </Tooltip>
      </Popover>
    </div>
  );
};

export default SettingsControl;

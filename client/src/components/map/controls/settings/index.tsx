'use client';

import { FC } from 'react';

import { PopoverArrow } from '@radix-ui/react-popover';
import { TooltipPortal } from '@radix-ui/react-tooltip';
import { Settings, X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useTheme } from '@/hooks/ui/theme';

import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { CONTROL_BUTTON_STYLES } from '../constants';

import type { SettingsControlProps } from './types';

export const SettingsControl: FC<SettingsControlProps> = ({
  className,
  children,
}: SettingsControlProps) => {
  const theme = useTheme();
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
                  [CONTROL_BUTTON_STYLES.dark]: theme === 'dark',
                })}
                aria-label="Map style"
                type="button"
              >
                <Settings className="h-full w-full" />
              </button>
            </TooltipTrigger>
          </PopoverTrigger>

          <TooltipPortal>
            <TooltipContent side="left" align="center">
              <div className="text-xxs font-serif">Map style</div>
              <TooltipArrow className="fill-white" width={10} height={5} />
            </TooltipContent>
          </TooltipPortal>

          <PopoverContent side="left" align="start">
            {children}
            <PopoverClose className="absolute right-4 top-4" aria-label="Close">
              <X className="h-6 w-6" />
            </PopoverClose>
            <PopoverArrow className="fill-white" width={10} height={5} />
          </PopoverContent>
        </Tooltip>
      </Popover>
    </div>
  );
};

export default SettingsControl;

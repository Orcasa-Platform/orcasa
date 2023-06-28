'use client';

import { FC } from 'react';

import { PopoverArrow } from '@radix-ui/react-popover';
import { TooltipPortal } from '@radix-ui/react-tooltip';
import { Settings } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
                  // [CONTROL_BUTTON_STYLES.disabled]: false,
                })}
                aria-label="Map settings"
                type="button"
              >
                <Settings className="h-full w-full" />
              </button>
            </TooltipTrigger>
          </PopoverTrigger>

          <TooltipPortal>
            <TooltipContent side="left" align="center">
              <div className="text-xxs">Map settings</div>

              <TooltipArrow className="fill-white" width={10} height={5} />
            </TooltipContent>
          </TooltipPortal>

          <PopoverContent side="left" align="start">
            {children}
            <PopoverArrow className="fill-white" width={10} height={5} />
          </PopoverContent>
        </Tooltip>
      </Popover>
    </div>
  );
};

export default SettingsControl;

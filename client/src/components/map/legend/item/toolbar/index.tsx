import { useState } from 'react';

import { PopoverArrow } from '@radix-ui/react-popover';
import { Eye, EyeOff, X } from 'lucide-react';
import Opacity from 'public/icons/opacity.svg?sprite';

import { cn } from '@/lib/classnames';

import { LegendItemToolbarProps } from '@/components/map/legend/types';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Slider from './slider';

export const LegendItemToolbar: React.FC<LegendItemToolbarProps> = ({
  settings,
  settingsManager,
  onChangeOpacity,
  onChangeVisibility,
  onRemove,
}: LegendItemToolbarProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { opacity = 1, visibility = true } = settings || {};

  return (
    <div id="legend-toolbar" className="flex space-x-2">
      {settingsManager?.opacity && (
        <div className="flex items-start">
          <Popover
            onOpenChange={(open) => {
              setPopoverOpen(open);
            }}
          >
            <Tooltip delayDuration={500}>
              <PopoverTrigger asChild>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="vanilla"
                    size="icon-sm"
                    className={cn({
                      'pointer-events-none': popoverOpen,
                    })}
                  >
                    <Icon icon={Opacity} className="flex h-6 w-6" />
                    <span className="sr-only">Change opacity</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>

              <TooltipPortal>
                <TooltipContent align="end" alignOffset={-10}>
                  <div className="text-xxs">Opacity</div>
                  <TooltipArrow className="fill-white" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>

            <PopoverContent
              side="top"
              align="end"
              alignOffset={-10}
              className="max-w-[122px] px-2.5 pb-2.5 pt-2"
            >
              <div className="space-y-2">
                <div className="text-sm">Opacity</div>

                <Slider
                  className="z-10 w-full"
                  defaultValue={[opacity]}
                  min={0}
                  max={1}
                  step={0.01}
                  value={[opacity]}
                  onValueChange={(value) => {
                    if (onChangeOpacity) onChangeOpacity(value[0]);
                  }}
                />
              </div>
              <PopoverArrow className="z-0 block fill-white" width={11} height={5} />
            </PopoverContent>
          </Popover>
        </div>
      )}

      {settingsManager?.visibility && (
        <div className="flex items-start">
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="vanilla"
                size="icon-sm"
                className={cn({
                  'pointer-events-none': popoverOpen,
                })}
                onClick={() => {
                  if (onChangeVisibility) onChangeVisibility(!visibility);
                }}
              >
                {!!visibility && <Eye className="flex h-6 w-6" />}
                {!visibility && <EyeOff className="flex h-6 w-6" />}
                <span className="sr-only">{visibility ? 'Hide layer' : 'Show layer'}</span>
              </Button>
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent side="top" align="end" alignOffset={-10}>
                <div className="text-xxs">{visibility ? 'Hide layer' : 'Show layer'}</div>
                <TooltipArrow className="fill-white" width={10} height={5} />
              </TooltipContent>
            </TooltipPortal>
          </Tooltip>
        </div>
      )}

      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="vanilla"
            size="icon-sm"
            onClick={() => {
              if (onRemove) onRemove();
            }}
          >
            <X className="flex h-6 w-6" />
            <span className="sr-only">Remove layer</span>
          </Button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent side="top" align="end" alignOffset={-10}>
            <div className="text-xxs">Remove layer</div>
            <TooltipArrow className="fill-white" width={10} height={5} />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </div>
  );
};

export default LegendItemToolbar;

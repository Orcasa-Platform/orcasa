import { useState } from 'react';

import { PopoverArrow } from '@radix-ui/react-popover';
import { Eye, Info, EyeOff, Droplet, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { LegendItemToolbarProps } from '@/components/map/legend/types';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import LegendItemButton from './button';
import Slider from './slider';

export const LegendItemToolbar: React.FC<LegendItemToolbarProps> = ({
  info,
  settings,
  settingsManager,
  onChangeOpacity,
  onChangeVisibility,
  onChangeExpand,
}: LegendItemToolbarProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { opacity = 1, visibility = true, expand = true } = settings || {};

  return (
    <div id="legend-toolbar" className="mt-0.5 flex divide-x">
      <div className="flex space-x-1 pr-2">
        {settingsManager?.opacity && (
          <div className="flex items-start">
            <Popover
              onOpenChange={(open) => {
                setPopoverOpen(open);
              }}
            >
              <Tooltip delayDuration={500}>
                <PopoverTrigger asChild>
                  <TooltipTrigger
                    type="button"
                    aria-label="Change layer opacity"
                    className={cn({
                      'pointer-events-none': popoverOpen,
                    })}
                  >
                    <LegendItemButton Icon={Droplet} value={opacity} selected />
                  </TooltipTrigger>
                </PopoverTrigger>

                <TooltipContent
                  align="end"
                  alignOffset={-10}
                  className="border-primary bg-primary rounded-none"
                >
                  <div className="text-xxs text-white">Opacity</div>

                  <TooltipArrow className="fill-primary" width={10} height={5} />
                </TooltipContent>
              </Tooltip>

              <PopoverContent
                side="top"
                align="end"
                alignOffset={-10}
                className="border-primary bg-primary max-w-[122px] px-2.5 pb-2.5 pt-1"
              >
                <div className="space-y-2">
                  <div className="text-xxs text-secondary text-center">Opacity</div>

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
                <PopoverArrow className="fill-primary z-0 block" width={11} height={5} />
              </PopoverContent>
            </Popover>
          </div>
        )}

        {settingsManager?.visibility && (
          <div className="flex items-start">
            <Tooltip delayDuration={500}>
              <TooltipTrigger
                type="button"
                aria-label={visibility ? 'Hide layer' : 'Show layer'}
                className={cn({
                  'pointer-events-none': popoverOpen,
                })}
                onClick={() => {
                  if (onChangeVisibility) onChangeVisibility(!visibility);
                }}
              >
                <LegendItemButton Icon={visibility ? Eye : EyeOff} />
              </TooltipTrigger>

              <TooltipContent
                side="top"
                align="end"
                alignOffset={-10}
                className="border-primary bg-primary rounded-none"
              >
                <div className="text-xxs text-white">
                  {visibility ? 'Hide layer' : 'Show layer'}
                </div>

                <TooltipArrow className="fill-primary" width={10} height={5} />
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {settingsManager?.info && (
          <div className="flex items-start">
            <Dialog>
              <Tooltip delayDuration={500}>
                <DialogTrigger asChild>
                  <TooltipTrigger
                    type="button"
                    aria-label="Show info"
                    className={cn({
                      'pointer-events-none': popoverOpen,
                    })}
                  >
                    <LegendItemButton Icon={Info} />
                  </TooltipTrigger>
                </DialogTrigger>

                <TooltipContent
                  side="top"
                  align="end"
                  alignOffset={-10}
                  className="border-primary bg-primary rounded-none"
                >
                  <div className="text-xxs text-white">Show info</div>

                  <TooltipArrow className="fill-primary" width={10} height={5} />
                </TooltipContent>

                <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>{info}</DialogContent>
              </Tooltip>
            </Dialog>
          </div>
        )}
      </div>

      {settingsManager?.expand && (
        <div className="pl-2">
          <div className="flex items-start">
            <Tooltip delayDuration={500}>
              {/* <AccordionTrigger> */}
              <TooltipTrigger
                type="button"
                aria-label={expand ? 'Collapse layer' : 'Expand layer'}
                className={cn({
                  'pointer-events-none': popoverOpen,
                })}
                onClick={() => {
                  if (onChangeExpand) onChangeExpand(!expand);
                }}
              >
                <LegendItemButton
                  Icon={ChevronDown}
                  className={cn({
                    'rotate-180': !expand,
                    'rotate-0 transform transition-transform': expand,
                  })}
                />
              </TooltipTrigger>
              {/* </AccordionTrigger> */}

              <TooltipContent
                side="top"
                align="end"
                alignOffset={-10}
                className="border-primary bg-primary rounded-none"
              >
                <div className="text-xxs text-white">
                  {expand ? 'Collapse layer' : 'Expand layer'}
                </div>

                <TooltipArrow className="fill-primary" width={10} height={5} />
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

export default LegendItemToolbar;

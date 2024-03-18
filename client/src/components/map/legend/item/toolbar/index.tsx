import { useState } from 'react';

import { Eye, EyeOff, X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { LegendItemToolbarProps } from '@/components/map/legend/types';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger, PopoverArrow } from '@/components/ui/popover';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipPortal,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Opacity from '@/styles/icons/opacity.svg';

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
    <div id="legend-toolbar" className="flex">
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
                    size="icon-xs"
                    className={cn({
                      'rounded-full': true,
                      'pointer-events-none': popoverOpen,
                    })}
                  >
                    <Opacity className="flex h-4 w-4" />
                    <span className="sr-only">Change opacity</span>
                  </Button>
                </TooltipTrigger>
              </PopoverTrigger>

              <TooltipPortal>
                <TooltipContent variant="dark" align="end" alignOffset={-10}>
                  <div className="text-xs">Opacity</div>
                  <TooltipArrow variant="dark" width={10} height={5} />
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>

            <PopoverContent
              variant="dark"
              side="top"
              align="end"
              alignOffset={-10}
              className="max-w-[122px] rounded-lg px-2.5 pb-2.5 pt-2"
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
              <PopoverArrow variant="dark" className="z-0 block" width={11} height={5} />
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
                size="icon-xs"
                className={cn({
                  'rounded-full': true,
                  'pointer-events-none': popoverOpen,
                })}
                onClick={() => {
                  if (onChangeVisibility) onChangeVisibility(!visibility);
                }}
              >
                {!!visibility && <Eye className="flex h-4 w-4" />}
                {!visibility && <EyeOff className="flex h-4 w-4" />}
                <span className="sr-only">{visibility ? 'Hide layer' : 'Show layer'}</span>
              </Button>
            </TooltipTrigger>

            <TooltipPortal>
              <TooltipContent variant="dark" side="top" align="end" alignOffset={-10}>
                <div className="text-xs">{visibility ? 'Hide layer' : 'Show layer'}</div>
                <TooltipArrow variant="dark" width={10} height={5} />
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
            size="icon-xs"
            className="rounded-full"
            onClick={() => {
              if (onRemove) onRemove();
            }}
          >
            <X className="flex h-4 w-4" />
            <span className="sr-only">Remove layer</span>
          </Button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent variant="dark" side="top" align="end" alignOffset={-10}>
            <div className="text-xs">Remove layer</div>
            <TooltipArrow variant="dark" width={10} height={5} />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </div>
  );
};

export default LegendItemToolbar;

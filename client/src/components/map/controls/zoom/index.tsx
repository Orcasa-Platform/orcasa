'use client';

import { FC, useCallback, MouseEvent } from 'react';

import { TooltipPortal } from '@radix-ui/react-tooltip';
import { Minus, Plus } from 'lucide-react';
import { useMap } from 'react-map-gl/maplibre';

import { cn } from '@/lib/classnames';

import { useTheme } from '@/hooks/ui/theme';

import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { CONTROL_BUTTON_STYLES } from '../constants';

import type { ZoomControlProps } from './types';

export const ZoomControl: FC<ZoomControlProps> = ({ className }: ZoomControlProps) => {
  const { default: mapRef } = useMap();
  const zoom = mapRef?.getZoom();
  const minZoom = mapRef?.getMinZoom();
  const maxZoom = mapRef?.getMaxZoom();
  const theme = useTheme();
  const increaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      mapRef?.zoomIn();
    },
    [mapRef],
  );

  const decreaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      mapRef?.zoomOut();
    },
    [mapRef],
  );

  return (
    <div className={cn('flex flex-col', className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn({
              [CONTROL_BUTTON_STYLES.default]: true,
              [CONTROL_BUTTON_STYLES.hover]: zoom !== maxZoom,
              [CONTROL_BUTTON_STYLES.active]: zoom !== maxZoom,
              [CONTROL_BUTTON_STYLES.disabled]: zoom === maxZoom,
              [CONTROL_BUTTON_STYLES.dark]: theme === 'dark',
            })}
            aria-label="Zoom in"
            type="button"
            disabled={zoom === maxZoom}
            onClick={increaseZoom}
          >
            <Plus className="h-[24px] w-[24px]" />
          </button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent side="left" align="center">
            <div className="text-xxs">Zoom in</div>

            <TooltipArrow className="fill-white" width={10} height={5} />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn({
              [CONTROL_BUTTON_STYLES.default]: true,
              'border-t-0': true,
              [CONTROL_BUTTON_STYLES.hover]: zoom !== minZoom,
              [CONTROL_BUTTON_STYLES.active]: zoom !== minZoom,
              [CONTROL_BUTTON_STYLES.disabled]: zoom === minZoom,
              [CONTROL_BUTTON_STYLES.dark]: theme === 'dark',
            })}
            aria-label="Zoom out"
            type="button"
            disabled={zoom === minZoom}
            onClick={decreaseZoom}
          >
            <Minus className="h-[24px] w-[24px]" />
          </button>
        </TooltipTrigger>

        <TooltipPortal>
          <TooltipContent side="left" align="center">
            <div className="text-xxs">Zoom out</div>

            <TooltipArrow className="fill-white" width={10} height={5} />
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </div>
  );
};

export default ZoomControl;

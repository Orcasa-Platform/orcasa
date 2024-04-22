'use client';

import { FC, useCallback, MouseEvent } from 'react';

import { useMap } from 'react-map-gl';

import { Minus, Plus } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { CONTROL_BUTTON_STYLES } from '../constants';

import type { ZoomControlProps } from './types';

export const ZoomControl: FC<ZoomControlProps> = ({ className }: ZoomControlProps) => {
  const { default: mapRef } = useMap();
  const zoom = mapRef?.getZoom();
  const minZoom = mapRef?.getMinZoom();
  const maxZoom = mapRef?.getMaxZoom();
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
      <button
        className={cn({
          [CONTROL_BUTTON_STYLES.default]: true,
          'rounded-b-none border-b-gray-500': true,
          [CONTROL_BUTTON_STYLES.hover]: zoom !== maxZoom,
          [CONTROL_BUTTON_STYLES.focus]: zoom !== maxZoom,
          [CONTROL_BUTTON_STYLES.disabled]: zoom === maxZoom,
        })}
        aria-label="Zoom in"
        type="button"
        disabled={zoom === maxZoom}
        onClick={increaseZoom}
      >
        <Plus className="h-5 w-5" />
      </button>

      <button
        className={cn({
          [CONTROL_BUTTON_STYLES.default]: true,
          'rounded-t-none border-t-0': true,
          [CONTROL_BUTTON_STYLES.hover]: zoom !== minZoom,
          [CONTROL_BUTTON_STYLES.focus]: zoom !== minZoom,
          [CONTROL_BUTTON_STYLES.disabled]: zoom === minZoom,
        })}
        aria-label="Zoom out"
        type="button"
        disabled={zoom === minZoom}
        onClick={decreaseZoom}
      >
        <Minus className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ZoomControl;

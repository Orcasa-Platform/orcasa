'use client';

import { useEffect, useState, useCallback, FC } from 'react';

import ReactMapGL, { ViewState, ViewStateChangeEvent, MapboxEvent, useMap } from 'react-map-gl';

// * If you plan to use Mapbox (and not a fork):
// * 1) remove maplibre-gl,
// * 2) install Mapbox v1/v2 (v2 requires token)
// * 3) if you installed v2: provide the token to the map through the `mapboxAccessToken` property
// * 4) remove `mapLib` property

import { useDebounce } from 'rooks';

import env from '@/env.mjs';

import { cn } from '@/lib/classnames';

import { DEFAULT_VIEW_STATE } from './constants';
import type { CustomMapProps } from './types';

export const MapMapbox: FC<CustomMapProps> = ({
  // * if no id is passed, react-map-gl will store the map reference in a 'default' key:
  // * https://github.com/visgl/react-map-gl/blob/ecb27c8d02db7dd09d8104e8c2011bda6aed4b6f/src/components/use-map.tsx#L18
  id = 'default',
  children,
  className,
  viewState,
  constrainedAxis,
  initialViewState,
  bounds,
  onMapViewStateChange,
  dragPan,
  dragRotate,
  scrollZoom,
  doubleClickZoom,
  onLoad,
  ...mapboxProps
}: CustomMapProps) => {
  /**
   * REFS
   */
  const { [id]: mapRef } = useMap();

  /**
   * STATE
   */
  const [localViewState, setLocalViewState] = useState<Partial<ViewState> | null>(
    !initialViewState
      ? {
          ...DEFAULT_VIEW_STATE,
          ...viewState,
        }
      : null
  );
  const [isFlying, setFlying] = useState(false);
  const [loaded, setLoaded] = useState(false);

  /**
   * CALLBACKS
   */
  const debouncedViewStateChange = useDebounce((_viewState: Partial<ViewState>) => {
    if (onMapViewStateChange) onMapViewStateChange(_viewState);
  }, 250);

  const handleFitBounds = useCallback(() => {
    if (mapRef && bounds) {
      const { bbox, options } = bounds;
      // enabling fly mode avoids the map to be interrupted during the bounds transition
      setFlying(true);

      mapRef.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        options
      );
    }
  }, [bounds, mapRef]);

  const handleMapMove = useCallback(
    ({ viewState: _viewState }: ViewStateChangeEvent) => {
      const newViewState = {
        ..._viewState,
        latitude: constrainedAxis === 'y' ? localViewState?.latitude : _viewState.latitude,
        longitude: constrainedAxis === 'x' ? localViewState?.longitude : _viewState.longitude,
      };
      setLocalViewState(newViewState);
      debouncedViewStateChange(newViewState);
    },
    [constrainedAxis, localViewState?.latitude, localViewState?.longitude, debouncedViewStateChange]
  );

  const handleMapLoad = useCallback(
    (e: MapboxEvent<undefined>) => {
      setLoaded(true);

      if (onLoad) {
        onLoad(e);
      }
    },
    [onLoad]
  );

  useEffect(() => {
    if (mapRef && bounds) {
      handleFitBounds();
    }
  }, [mapRef, bounds, handleFitBounds]);

  useEffect(() => {
    setLocalViewState((prevViewState) => ({
      ...prevViewState,
      ...viewState,
    }));
  }, [viewState]);

  useEffect(() => {
    if (!bounds) return undefined;

    const { options } = bounds;
    const animationDuration = options?.duration || 0;
    let timeoutId: number;

    if (isFlying) {
      timeoutId = window.setTimeout(() => {
        setFlying(false);
      }, animationDuration);
    }

    return () => {
      if (timeoutId) {
        window.clearInterval(timeoutId);
      }
    };
  }, [bounds, isFlying]);

  return (
    <div className={cn('relative z-0 h-full w-full', className)}>
      <ReactMapGL
        id={id}
        initialViewState={initialViewState}
        dragPan={!isFlying && dragPan}
        dragRotate={!isFlying && dragRotate}
        scrollZoom={!isFlying && scrollZoom}
        doubleClickZoom={!isFlying && doubleClickZoom}
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
        // projection="globe"
        onMove={handleMapMove}
        onLoad={handleMapLoad}
        {...mapboxProps}
        {...localViewState}
      >
        {!!mapRef && loaded && !!children && children(mapRef.getMap())}
      </ReactMapGL>
    </div>
  );
};

export default MapMapbox;

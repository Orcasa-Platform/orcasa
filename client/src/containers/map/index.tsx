'use client';

import { useCallback } from 'react';
import { useEffect } from 'react';

import dynamic from 'next/dynamic';

import { LngLatBoundsLike, MapLayerMouseEvent, useMap, MapStyle } from 'react-map-gl/maplibre';
import { usePreviousImmediate } from 'rooks';

import { getCroppedBounds } from '@/lib/utils/map';

import { useBbox, useLayersInteractive, useLayersInteractiveIds, usePopup } from '@/store';

import { useGetLayers } from '@/types/generated/layer';
import type { LayerTyped } from '@/types/layers';
import { Bbox } from '@/types/map';

import { useMapPadding } from '@/hooks/map';

import Popup from '@/containers/map/popup';
import MapSettings from '@/containers/map/settings';
import MapSettingsManager from '@/containers/map/settings/manager';

import Map from '@/components/map';
import Controls from '@/components/map/controls';
import SettingsControl from '@/components/map/controls/settings';
import ZoomControl from '@/components/map/controls/zoom';
import { CustomMapProps } from '@/components/map/types';

import Attribution from './attribution';
import mapStyle from './map-style.json';
const LayerManager = dynamic(() => import('@/containers/map/layer-manager'), {
  ssr: false,
});

const Legend = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});

const getMapsDefaultProps = (
  bounds: LngLatBoundsLike,
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  },
): CustomMapProps => {
  return {
    id: 'default',
    initialViewState: {
      pitch: 0,
      bearing: 0,
      // The southern longitude doesn't go up to -90 on purpose so that the map looks better by
      // default i.e. less of the Antarctica is shown
      bounds: bounds ?? [-180, -80, 180, 90],
      padding,
    },
    minZoom: 1,
    maxZoom: 20,
  };
};

export default function MapContainer() {
  const padding = useMapPadding();
  const previousPadding = usePreviousImmediate(padding);

  const [bbox, setBbox] = useBbox();
  const [layersInteractive] = useLayersInteractive();
  const [layersInteractiveIds] = useLayersInteractiveIds();

  const [, setPopup] = usePopup();

  const { id, initialViewState, minZoom, maxZoom } = getMapsDefaultProps(
    bbox as LngLatBoundsLike,
    padding,
  );
  const { [id]: map } = useMap();

  useEffect(() => {
    // We only want to detect changes of padding, not the initial value (when
    // `previousPadding` === `null`) nor when the reference has changed
    const isPaddingDifferent =
      previousPadding !== null &&
      Object.values(padding).toString() !== Object.values(previousPadding).toString();

    if (map && isPaddingDifferent) {
      map.easeTo({ padding, duration: 500 });
    }
  }, [padding, previousPadding, bbox, map]);

  const { data: layersInteractiveData } = useGetLayers(
    {
      filters: {
        id: {
          $in: layersInteractive,
        },
      },
    },
    {
      query: {
        enabled: !!layersInteractive.length,
      },
    },
  );

  const handleMapViewStateChange = useCallback(() => {
    if (map) {
      // By cropping the bounds, we actually get the visible part of the map
      const bounds = map.getBounds();
      const croppedBounds = getCroppedBounds(bounds, padding, map.project, map.unproject);

      const bbox = croppedBounds
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        }) as Bbox;

      setBbox(bbox);
    }
  }, [map, padding, setBbox]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (
        layersInteractive.length &&
        layersInteractiveData?.data &&
        layersInteractiveData?.data.some((l) => {
          const attributes = l.attributes as LayerTyped;
          return attributes?.interaction_config?.events.some((ev) => ev.type === 'click');
        })
      ) {
        const p = Object.assign({}, e, { features: e.features ?? [] });

        setPopup(p);
      }
    },
    [layersInteractive, layersInteractiveData, setPopup],
  );

  return (
    <div className="h-screen w-screen">
      <Map
        id={id}
        initialViewState={initialViewState}
        minZoom={minZoom}
        maxZoom={maxZoom}
        mapStyle={mapStyle as MapStyle}
        interactiveLayerIds={layersInteractiveIds.map((id) => id.toString())}
        onClick={handleMapClick}
        onMapViewStateChange={handleMapViewStateChange}
      >
        {() => (
          <>
            <Controls className="absolute right-5 z-40 sm:right-6 sm:top-6">
              <SettingsControl>
                <MapSettings />
              </SettingsControl>
              <ZoomControl />
            </Controls>

            <LayerManager />
            <Attribution />
            <Popup />

            <MapSettingsManager />

            <Legend />
          </>
        )}
      </Map>
    </div>
  );
}

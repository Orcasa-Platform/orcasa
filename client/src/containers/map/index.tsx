'use client';

import { useCallback } from 'react';
import { useEffect } from 'react';

import { LngLatBoundsLike, MapLayerMouseEvent, useMap, GeoJSONSource } from 'react-map-gl';

import dynamic from 'next/dynamic';

import { usePreviousImmediate } from 'rooks';

import env from '@/env.mjs';

import { parseConfig, JSON_CONFIGURATION } from '@/lib/json-converter';

import { useLayersSettings } from '@/store';
import { useBbox, useLayersInteractive, useLayersInteractiveIds, usePopup } from '@/store';

import { useGetLayers } from '@/types/generated/layer';
import type { InteractionConfig, LayerTyped } from '@/types/layers';
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
    maxZoom: 12,
  };
};

export default function MapContainer() {
  const padding = useMapPadding();
  const previousPadding = usePreviousImmediate(padding);

  const [bbox, setBbox] = useBbox();
  const [layersInteractive] = useLayersInteractive();
  const [layersInteractiveIds] = useLayersInteractiveIds();

  const [, setPopup] = usePopup();

  const [layersSettings] = useLayersSettings();
  const { id, initialViewState, minZoom, maxZoom } = getMapsDefaultProps(
    bbox as LngLatBoundsLike,
    padding,
  );
  const { [id]: map } = useMap();

  // Add network icon marker to the map
  useEffect(() => {
    // Create a new canvas element
    const canvas = document.createElement('canvas');

    // Set the size of the image
    canvas.width = 20;
    canvas.height = 40;

    // Get the 2D rendering context
    const ctx = canvas.getContext('2d');

    // Draw a rectangle on the canvas
    if (!ctx) return;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get the image data from the canvas
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Create a Uint8Array from the image data
    const data = new Uint8Array(imageData.data.buffer);

    if (map) {
      // sdf is needed to be able to change icon color
      map.addImage('rect', { width: canvas.width, height: canvas.height, data }, { sdf: true });
    }
  }, [map]);

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
      const bounds = map.getBounds();
      const bbox = bounds
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        }) as Bbox;

      setBbox(bbox);
    }
  }, [map, setBbox]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      // Check if a cluster was clicked
      const features = map?.queryRenderedFeatures(e.point);
      if (features?.length && features.some((f) => f.properties?.cluster)) {
        // Get the cluster ID
        const clusterFeature = features.find((f) => f.properties?.cluster_id);
        const clusterId = clusterFeature?.properties?.cluster_id;
        const id = clusterFeature?.layer?.source as string;

        // Get the zoom level at which the cluster expands
        if (map && clusterId && id) {
          const source = map.getSource(id) as GeoJSONSource;
          source?.getClusterExpansionZoom(clusterId, function (err, zoom) {
            if (err || zoom === null || typeof zoom === 'undefined') return;
            // Zoom in to the cluster
            map.easeTo({
              center: e.lngLat,
              zoom: zoom,
            });
          });
        }
      }

      // Layer interaction
      if (
        layersInteractive.length &&
        layersInteractiveData?.data &&
        layersInteractiveData?.data.some((l) => {
          const attributes = l.attributes as LayerTyped;
          const layerSettings = l.id && layersSettings[l.id];
          const { params_config, interaction_config } = attributes;

          const parsedInteractionConfig = parseConfig<InteractionConfig | null>({
            config: interaction_config,
            params_config,
            settings: layerSettings || {},
            jsonConfiguration: JSON_CONFIGURATION,
          });

          if (parsedInteractionConfig?.events) {
            // Complex interaction layers with more than one source and interaction per layer
            return parsedInteractionConfig.events.some((ev) => ev.type === 'click');
          } else {
            // Simple interaction layers
            return attributes?.interaction_config?.events?.some((ev) => ev.type === 'click');
          }
        })
      ) {
        const p = Object.assign({}, e, { features: e.features ?? [] });

        setPopup(p);
      }
    },
    [layersInteractive, layersInteractiveData, setPopup, map, layersSettings],
  );

  return (
    <div className="absolute bottom-2 left-[90px] top-2 w-[calc(100vw-98px)] overflow-hidden rounded-lg">
      <Map
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_TOKEN}
        id={id}
        initialViewState={initialViewState}
        minZoom={minZoom}
        maxZoom={maxZoom}
        mapStyle="mapbox://styles/orcasa/clu14cfkp01nx01nrc851220b"
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
            <Popup />

            <MapSettingsManager />

            <Legend />
          </>
        )}
      </Map>
    </div>
  );
}

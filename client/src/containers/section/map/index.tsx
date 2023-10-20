'use client';

import { useCallback, useMemo } from 'react';
import { useEffect } from 'react';

import dynamic from 'next/dynamic';

import {
  LngLatBoundsLike,
  MapLayerMouseEvent,
  useMap,
  MapStyle,
  GeoJSONSource,
} from 'react-map-gl/maplibre';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { usePreviousImmediate } from 'rooks';

import { getCroppedBounds } from '@/lib/utils/map';

import {
  bboxAtom,
  layersInteractiveAtom,
  layersInteractiveIdsAtom,
  popupAtom,
  tmpBboxAtom,
} from '@/store';
import { mapSettingsAtom } from '@/store';

import { Section } from '@/types/app';
import { useGetLayers } from '@/types/generated/layer';
import type { LayerTyped } from '@/types/layers';
import { Bbox } from '@/types/map';

import { useMapPadding } from '@/hooks/map';
import { useDefaultBasemap } from '@/hooks/pages';

import Popup from '@/containers/section/map/popup';
import MapSettings from '@/containers/section/map/settings';
import MapSettingsManager from '@/containers/section/map/settings/manager';

import Map from '@/components/map';
import Controls from '@/components/map/controls';
import SettingsControl from '@/components/map/controls/settings';
import ZoomControl from '@/components/map/controls/zoom';
import { CustomMapProps } from '@/components/map/types';

import Attribution from './attribution';
import mapStyle from './map-style.json';
const LayerManager = dynamic(() => import('@/containers/section/map/layer-manager'), {
  ssr: false,
});

const Legend = dynamic(() => import('@/containers/section/map/legend'), {
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

export default function MapContainer({ section }: { section: Section }) {
  const padding = useMapPadding();
  const previousPadding = usePreviousImmediate(padding);

  const bbox = useRecoilValue(bboxAtom);
  const tmpBbox = useRecoilValue(tmpBboxAtom);
  const layersInteractive = useRecoilValue(layersInteractiveAtom);
  const layersInteractiveIds = useRecoilValue(layersInteractiveIdsAtom);

  const setBbox = useSetRecoilState(bboxAtom);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);
  const setPopup = useSetRecoilState(popupAtom);

  const setMapSettings = useSetRecoilState(mapSettingsAtom);
  const defaultBasemap = useDefaultBasemap(section);

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

  // Reset map settings every time the section changes
  useEffect(() => {
    if (defaultBasemap) {
      setMapSettings((prev) => ({
        ...prev,
        basemap: defaultBasemap,
      }));
    }
  }, [setMapSettings, defaultBasemap]);

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

  const tmpBounds: CustomMapProps['bounds'] = useMemo(() => {
    if (tmpBbox) {
      return {
        bbox: tmpBbox,
        options: {
          padding,
        },
      };
    }
  }, [tmpBbox, padding]);

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
      setTmpBbox(null);
    }
  }, [map, padding, setBbox, setTmpBbox]);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      // Check if a cluster was clicked
      const features = map?.queryRenderedFeatures(e.point);
      if (features?.length && features.some((f) => f.properties.cluster)) {
        // Get the cluster ID
        const clusterFeature = features.find((f) => f.properties.cluster_id);
        const clusterId = clusterFeature?.properties.cluster_id;
        const id = clusterFeature?.layer?.source;

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
          return attributes?.interaction_config?.events.some((ev) => ev.type === 'click');
        })
      ) {
        const p = Object.assign({}, e, { features: e.features ?? [] });

        setPopup(p);
      }
    },
    [layersInteractive, layersInteractiveData, setPopup, map],
  );

  return (
    <div className="h-screen w-screen">
      <Map
        id={id}
        initialViewState={initialViewState}
        bounds={tmpBounds}
        minZoom={minZoom}
        maxZoom={maxZoom}
        mapStyle={mapStyle as MapStyle}
        interactiveLayerIds={layersInteractiveIds}
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

'use client';

import { useEffect, useState } from 'react';

import { parseAsJson, useQueryState } from 'next-usequerystate';
import { MapLayerMouseEvent } from 'react-map-gl/maplibre';

// MAP

// Map settings
export const useMapSettings = () => {
  return useQueryState(
    'map-settings',
    parseAsJson<{ basemap: string; labels: string }>().withDefault({
      basemap: 'basemap-satellite',
      labels: 'labels-dark',
    }),
  );
};

// Map viewport
export const useBbox = () => {
  return useQueryState('bbox', parseAsJson<[number, number, number, number] | null>());
};

// Sidebar and menus
export const useSidebarOpen = () => {
  return useState(true);
};

// Map layers
export const useLayers = () => {
  return useQueryState('layers', parseAsJson<number[]>().withDefault([]));
};

export const useLayersSettings = () => {
  return useQueryState(
    'layers-settings',
    parseAsJson<Record<string, { opacity?: number; visibility?: boolean }>>().withDefault({}),
  );
};

export const useLayersInteractive = () => {
  return useState<number[]>([]);
};

export const useLayersInteractiveIds = () => {
  return useState<number[]>([]);
};

export const usePopup = () => {
  return useState<MapLayerMouseEvent | null>(null);
};

export const DEFAULT_SETTINGS = {};

export function useSyncLayersAndSettings() {
  const [layers] = useLayers();
  const [layersSettings, setLayersSettings] = useLayersSettings();
  const [layersInteractive, setLayersInteractive] = useLayersInteractive();

  const [, setPopup] = usePopup();

  // Remove the layer settings for the layers that are not on the map anymore
  useEffect(() => {
    const removedLayerIds = Object.keys(layersSettings).filter(
      (id) => !layers.includes(parseInt(id)),
    );

    if (removedLayerIds.length > 0) {
      const newLayersSettings = { ...layersSettings };
      removedLayerIds.forEach((id) => {
        delete newLayersSettings[id];
      });
      setLayersSettings(newLayersSettings);
    }
  }, [layers, layersSettings, setLayersSettings]);

  // Remove the layer interactivity of the layers that are not on the map anymore
  useEffect(() => {
    const removedLayerIds = layersInteractive.filter((id) => !layers.includes(id));

    if (removedLayerIds.length > 0) {
      setLayersInteractive(layersInteractive.filter((id) => !removedLayerIds.includes(id)));
    }
  }, [layers, layersInteractive, setLayersInteractive]);

  // Reset the popup if there are no interactive layers on the map anymore
  useEffect(() => {
    if (layersInteractive.length === 0) {
      setPopup(null);
    }
  }, [layersInteractive, setPopup]);

  return null;
}

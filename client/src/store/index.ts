'use client';

import { useEffect, useMemo } from 'react';

import { MapLayerMouseEvent } from 'react-map-gl';

import { atom, useAtom } from 'jotai';
import { parseAsJson, useQueryState } from 'next-usequerystate';

// MAP

// Map settings
export const useMapSettings = () => {
  return useQueryState(
    'map-settings',
    parseAsJson<{
      basemap?: string;
      boundaries: string | null;
      labels: string | null;
    }>().withDefault({
      boundaries: null,
      labels: null,
    }),
  );
};

// Map viewport
export const useBbox = () => {
  return useQueryState('bbox', parseAsJson<[number, number, number, number] | null>());
};

// Sidebar and menus
const sidebarOpenAtom = atom(true);
export const useSidebarOpen = () => {
  return useAtom(sidebarOpenAtom);
};

// Map layers
export const useLayers = () => {
  return useQueryState('layers', parseAsJson<number[]>().withDefault([]));
};

export const useLayersSettings = () => {
  return useQueryState(
    'layers-settings',
    parseAsJson<
      Record<string, { opacity?: number; visibility?: boolean; [key: string]: unknown }>
    >().withDefault({}),
  );
};

export const useMapSearchParams = () => {
  const [mapSettings] = useMapSettings();
  const [bbox] = useBbox();
  const [layers] = useLayers();
  const [layersSettings] = useLayersSettings();

  const searchParams = useMemo(() => {
    return new URLSearchParams({
      'map-settings': JSON.stringify(mapSettings),
      ...(bbox ? { bbox: JSON.stringify(bbox) } : {}),
      layers: JSON.stringify(layers),
      'layers-settings': JSON.stringify(layersSettings),
    });
  }, [mapSettings, bbox, layers, layersSettings]);

  return searchParams;
};

const layersInteractiveAtom = atom<number[]>([]);
export const useLayersInteractive = () => {
  return useAtom(layersInteractiveAtom);
};

const layersInteractiveIdsAtom = atom<number[]>([]);
export const useLayersInteractiveIds = () => {
  return useAtom(layersInteractiveIdsAtom);
};

const popupAtom = atom<MapLayerMouseEvent | null>(null);
export const usePopup = () => {
  return useAtom(popupAtom);
};

// To store the state open/closed of the the mobile menu
const mobileMenuAtom = atom<boolean>(false);
export const useMobileMenu = () => {
  return useAtom(mobileMenuAtom);
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

// SIDEBAR

const sidebarScrollAtom = atom<number>(0);
/**
 * This hook is used to temporarily store the scroll position of the sidebar to restore it later
 */
export const useSidebarScroll = () => {
  return useAtom(sidebarScrollAtom);
};

import { useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';

import type { AnyLayer } from 'mapbox-gl';

import { useMapSettings } from '@/store/index';

import { BOUNDARIES, LABELS } from '@/constants/basemaps';

type AnyLayerWithMetadata = AnyLayer & {
  metadata: Record<string, unknown>;
};

const MapSettingsManager = () => {
  const { default: mapRef } = useMap();
  const loaded = mapRef?.loaded();
  const [{ basemap, boundaries, labels }] = useMapSettings();

  const handleGroup = useCallback(
    (groups: string[], groupId: string, visible = true) => {
      if (!mapRef) return;
      const map = mapRef.getMap();
      const { layers, metadata } = mapRef.getStyle();

      const { 'mapbox:groups': metadataGroups } = metadata as {
        'mapbox:groups': Record<string, { name: string; [key: string]: unknown }>;
      };

      const typedLayers = layers as AnyLayerWithMetadata[];
      const GROUPS = Object.keys(metadataGroups || {}).filter((k) => {
        const { name } = metadataGroups[k];
        const matchedGroups = groups.map((g) => name.toLowerCase().includes(g));
        return matchedGroups.some(Boolean);
      });

      const GROUPS_META = GROUPS.map((gId) => ({
        ...(metadata ? metadataGroups[gId] : {}),
        id: gId,
      }));
      const GROUP_TO_DISPLAY = GROUPS_META.find((_group) => _group?.name?.includes(groupId));
      const GROUPS_LAYERS = typedLayers.filter((l) => {
        const { metadata: layerMetadata } = l;
        if (!layerMetadata) return false;
        const gr = layerMetadata?.['mapbox:group'] as string;
        return GROUPS.includes(gr);
      });

      GROUPS_LAYERS.forEach((_layer) => {
        const match = _layer.metadata?.['mapbox:group'] === GROUP_TO_DISPLAY?.id && visible;
        if (!match) {
          map.setLayoutProperty(_layer.id, 'visibility', 'none');
        } else {
          map.setLayoutProperty(_layer.id, 'visibility', 'visible');
        }
      });
    },
    [mapRef],
  );

  const handleStyleLoad = useCallback(() => {
    if (basemap) {
      handleGroup(['basemap'], basemap);
    }
    handleGroup(['labels'], `labels-${labels ?? LABELS[0].slug}`, labels !== null);
    handleGroup(
      ['boundaries'],
      `boundaries-${boundaries ?? BOUNDARIES[0].slug}`,
      boundaries !== null,
    );
  }, [basemap, boundaries, labels, handleGroup]);

  // * handle style load
  useEffect(() => {
    if (!mapRef) return;
    mapRef.on('style.load', handleStyleLoad);

    return () => {
      mapRef.off('style.load', handleStyleLoad);
    };
  }, [mapRef, loaded, handleStyleLoad]);

  // * handle basemap, boundaries, labels
  useEffect(() => {
    if (!mapRef) return;
    if (basemap) {
      handleGroup(['basemap'], basemap);
    }

    handleGroup(['labels'], `labels-${labels ?? LABELS[0].slug}`, labels !== null);
    handleGroup(
      ['boundaries'],
      `boundaries-${boundaries ?? BOUNDARIES[0].slug}`,
      boundaries !== null,
    );
  }, [mapRef, loaded, basemap, boundaries, labels, handleGroup]);

  return null;
};

export default MapSettingsManager;

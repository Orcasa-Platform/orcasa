import { useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';

import type { LayerSpecification } from 'maplibre-gl';
import { useRecoilValue } from 'recoil';

import { mapSettingsAtom } from '@/store/index';

type AnyLayerWithMetadata = LayerSpecification & {
  metadata: Record<string, unknown>;
};

const MapSettingsManager = () => {
  const { default: mapRef } = useMap();
  const loaded = mapRef?.loaded();
  const { basemap, labels } = useRecoilValue(mapSettingsAtom);

  const handleGroup = useCallback(
    (groups: string[], groupId: string, visible = true) => {
      if (!mapRef) return;
      const map = mapRef.getMap();
      const { layers, metadata } = mapRef.getStyle();

      const lys = layers as AnyLayerWithMetadata[];

      const GROUPS = Object.keys(metadata?.['mapbox:groups'] || {}).filter((k) => {
        const { name } = metadata?.['mapbox:groups'][k];

        const matchedGroups = groups.map((rgr) => name.toLowerCase().includes(rgr));

        return matchedGroups.some((bool) => bool);
      });

      const GROUPS_META = GROUPS.map((gId) => ({
        ...(metadata && metadata['mapbox:groups'][gId]),
        id: gId,
      }));
      const GROUP_TO_DISPLAY = GROUPS_META.find((_group) => _group.name.includes(groupId)) || {};

      const GROUPS_LAYERS = lys.filter((l) => {
        const { metadata: layerMetadata } = l;
        if (!layerMetadata) return false;

        const gr = layerMetadata?.['mapbox:group'] as string;
        return GROUPS.includes(gr);
      });

      GROUPS_LAYERS.forEach((_layer) => {
        const match = _layer.metadata?.['mapbox:group'] === GROUP_TO_DISPLAY.id && visible;
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
    handleGroup(['basemap'], basemap);
    handleGroup(['labels'], labels);
  }, [basemap, labels, handleGroup]);

  // * handle style load
  useEffect(() => {
    if (!mapRef) return;
    mapRef.on('style.load', handleStyleLoad);

    return () => {
      mapRef.off('style.load', handleStyleLoad);
    };
  }, [mapRef, loaded, handleStyleLoad]);

  // * handle basemap, labels
  useEffect(() => {
    if (!mapRef) return;

    handleGroup(['basemap'], basemap);
    handleGroup(['labels'], labels);
  }, [mapRef, loaded, basemap, labels, handleGroup]);

  return null;
};

export default MapSettingsManager;

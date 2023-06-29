import { useCallback, useEffect } from 'react';

import { useMap } from 'react-map-gl';

import { AnyLayer } from 'mapbox-gl';
import { useRecoilValue } from 'recoil';

import { mapSettingsAtom } from '@/store/index';

import { BASEMAPS } from '@/constants/basemaps';

type AnyLayerWithMetadata = AnyLayer & {
  metadata: Record<string, unknown>;
};

const MapSettingsManager = () => {
  const { default: mapRef } = useMap();
  const loaded = mapRef?.loaded();
  const { basemap, labels, boundaries, roads } = useRecoilValue(mapSettingsAtom);

  const handleGroup = useCallback(
    (groups: string[], groupId: string, visible = true) => {
      if (!mapRef) return;
      const map = mapRef.getMap();
      const { layers, metadata } = mapRef.getStyle();

      const lys = layers as AnyLayerWithMetadata[];

      const GROUPS = Object.keys(metadata['mapbox:groups']).filter((k) => {
        const { name } = metadata['mapbox:groups'][k];

        const matchedGroups = groups.map((rgr) => name.toLowerCase().includes(rgr));

        return matchedGroups.some((bool) => bool);
      });

      const GROUPS_META = GROUPS.map((gId) => ({
        ...metadata['mapbox:groups'][gId],
        id: gId,
      }));
      const GROUP_TO_DISPLAY = GROUPS_META.find((_group) => _group.name.includes(groupId)) || {};

      const GROUPS_LAYERS = lys.filter((l) => {
        const { metadata: layerMetadata } = l;
        if (!layerMetadata) return false;

        const gr = layerMetadata['mapbox:group'];
        return GROUPS.includes(gr);
      });

      GROUPS_LAYERS.forEach((_layer) => {
        const match = _layer.metadata['mapbox:group'] === GROUP_TO_DISPLAY.id && visible;
        if (!match) {
          map.setLayoutProperty(_layer.id, 'visibility', 'none');
        } else {
          map.setLayoutProperty(_layer.id, 'visibility', 'visible');
        }
      });
    },
    [mapRef]
  );

  const handleStyleLoad = useCallback(() => {
    const B = BASEMAPS.find((b) => b.value === basemap);

    handleGroup(['basemap'], basemap);
    handleGroup(['labels'], labels);

    if (B) {
      handleGroup(['boundaries'], B.settings.boundaries, boundaries);
      handleGroup(['roads'], B.settings.roads, roads);
    }
  }, [basemap, labels, boundaries, roads, handleGroup]);

  // * handle style load
  useEffect(() => {
    if (!mapRef) return;
    mapRef.on('style.load', handleStyleLoad);

    return () => {
      mapRef.off('style.load', handleStyleLoad);
    };
  }, [mapRef, loaded, handleStyleLoad]);

  // * handle basemap, labels, boundaries, roads
  useEffect(() => {
    if (!mapRef) return;

    const B = BASEMAPS.find((b) => b.value === basemap);

    handleGroup(['basemap'], basemap);
    handleGroup(['labels'], labels);

    if (B) {
      handleGroup(['boundaries'], B.settings.boundaries, boundaries);
      handleGroup(['roads'], B.settings.roads, roads);
    }
  }, [mapRef, loaded, basemap, labels, boundaries, roads, handleGroup]);

  return null;
};

export default MapSettingsManager;

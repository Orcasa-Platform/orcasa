'use client';

import { useCallback, useMemo } from 'react';

import { LngLatBoundsLike, useMap } from 'react-map-gl';

import dynamic from 'next/dynamic';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { bboxAtom, tmpBboxAtom } from '@/store';

import { Bbox } from '@/types/map';

import { MAPBOX_STYLES } from '@/constants/mapbox';

import MapSettings from '@/containers/home/map/settings';
import MapSettingsManager from '@/containers/home/map/settings/manager';

import Map from '@/components/map';
import Controls from '@/components/map/controls';
import SettingsControl from '@/components/map/controls/settings';
import ZoomControl from '@/components/map/controls/zoom';
import { CustomMapProps } from '@/components/map/types';

const LayerManager = dynamic(() => import('@/containers/home/map/layer-manager'), {
  ssr: false,
});

const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,
    bounds: [-159.86, 6.31, -65.75, 60.67],
  },
  minZoom: 2,
  maxZoom: 20,
};

export default function MapContainer() {
  const { id, initialViewState, minZoom, maxZoom } = DEFAULT_PROPS;

  const { [id]: map } = useMap();

  const bbox = useRecoilValue(bboxAtom);
  const tmpBbox = useRecoilValue(tmpBboxAtom);

  const setBbox = useSetRecoilState(bboxAtom);
  const setTmpBbox = useSetRecoilState(tmpBboxAtom);

  const tmpBounds: CustomMapProps['bounds'] = useMemo(() => {
    if (tmpBbox) {
      return {
        bbox: tmpBbox,
        options: {
          padding: {
            top: 50,
            bottom: 50,
            // left: sidebarOpen ? 640 + 50 : 50,
            left: 50,
            right: 50,
          },
        },
      };
    }
  }, [tmpBbox]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleViewState = useCallback(() => {
    if (map) {
      const b = map
        .getBounds()
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        }) as Bbox;

      setBbox(b);
      setTmpBbox(null);
    }
  }, [map, setBbox, setTmpBbox]);

  return (
    <div className="h-screen w-screen">
      <Map
        id={id}
        initialViewState={{
          ...initialViewState,
          ...(bbox && {
            bounds: bbox as LngLatBoundsLike,
          }),
        }}
        bounds={tmpBounds}
        minZoom={minZoom}
        maxZoom={maxZoom}
        mapStyle={MAPBOX_STYLES.default}
        onMapViewStateChange={handleViewState}
      >
        {() => (
          <>
            <Controls className="absolute right-5 top-12 z-40 sm:right-6 sm:top-6">
              <ZoomControl />
              <SettingsControl>
                <MapSettings />
              </SettingsControl>
            </Controls>

            <LayerManager />

            <MapSettingsManager id={id} />
          </>
        )}
      </Map>
    </div>
  );
}

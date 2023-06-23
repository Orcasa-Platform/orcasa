'use client';

import { useCallback } from 'react';

import { useMap } from 'react-map-gl';

import { Bbox } from '@/types/map';

import Map from '@/components/map';
import Controls from '@/components/map/controls';
import ZoomControl from '@/components/map/controls/zoom';
import { CustomMapProps } from '@/components/map/types';

const DEFAULT_PROPS: CustomMapProps = {
  id: 'default',
  initialViewState: {
    longitude: 0,
    latitude: 20,
    zoom: 2,
    pitch: 0,
    bearing: 0,
    bounds: [-122.519, 37.7045, -122.355, 37.829],
  },
  minZoom: 2,
  maxZoom: 10,
  // mapStyle: MAPBOX_STYLES.explore,
};

export default function MapContainer() {
  const { id, initialViewState, minZoom, maxZoom, mapStyle } = DEFAULT_PROPS;

  const { [id]: map } = useMap();

  const handleViewState = useCallback(() => {
    if (map) {
      const b = map
        .getBounds()
        .toArray()
        .flat()
        .map((v: number) => {
          return parseFloat(v.toFixed(2));
        }) as Bbox;

      // setBbox(b as Bbox);
      // setTmpBbox(null);
    }
  }, [
    map, //setBbox, setTmpBbox
  ]);

  return (
    <div className="h-screen w-screen">
      <Map
        id={id}
        initialViewState={initialViewState}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onMapViewStateChange={handleViewState}
      >
        {() => (
          <>
            <Controls className="absolute right-5 top-12 z-40 space-y-10 sm:right-6 sm:top-6">
              <ZoomControl />
            </Controls>
          </>
        )}
      </Map>
    </div>
  );
}

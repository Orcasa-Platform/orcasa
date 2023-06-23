import { AnyLayer } from 'mapbox-gl';

export type LngLat = { lng: number; lat: number };

export type Bbox = [number, number, number, number];

export type AnyLayerWithMetadata = AnyLayer & {
  metadata?: any;
};

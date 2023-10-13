import { PaddingOptions, LngLatBounds, LngLatLike } from 'maplibre-gl';
import { Point } from 'react-map-gl/maplibre';

/**
 * Return bounds which have been cropped based on padding values
 */
export const getCroppedBounds = (
  bounds: LngLatBounds,
  padding: PaddingOptions,
  project: (lnglat: LngLatLike) => Point,
  unproject: (lnglat: Point) => LngLatLike,
) => {
  const swLngLat = bounds.getSouthWest();
  const neLngLat = bounds.getNorthEast();

  const swProjection = project(swLngLat);
  swProjection.x += padding.left;
  swProjection.y -= padding.bottom;

  const neProjection = project(neLngLat);
  neProjection.x -= padding.right;
  neProjection.y += padding.top;

  const offsetSWLngLat = unproject(swProjection);
  const offsetNELngLat = unproject(neProjection);

  return new LngLatBounds(offsetSWLngLat, offsetNELngLat);
};

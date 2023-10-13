import { ComponentProps } from 'react';

import { Map, FitBoundsOptions } from 'maplibre-gl';
import ReactMapGL from 'react-map-gl/maplibre';
import type { ViewState } from 'react-map-gl/maplibre';

export interface CustomMapProps extends ComponentProps<typeof ReactMapGL> {
  id: string;
  /** A function that returns the map instance */
  children?: (map: Map) => React.ReactNode;

  /** Custom css class for styling */
  className?: string;

  /** An string that defines the rotation axis */
  constrainedAxis?: 'x' | 'y';

  /** An object that defines the bounds */
  bounds?: {
    bbox: readonly [number, number, number, number];
    options?: FitBoundsOptions;
    viewportOptions?: Partial<ViewState>;
  };

  /** A function that exposes the viewport */
  onMapViewStateChange?: (viewstate: Partial<ViewState>) => void;
}

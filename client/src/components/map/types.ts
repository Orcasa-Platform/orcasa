import type { ViewState, MapProps, FitBoundsOptions, MapboxMap } from 'react-map-gl';
export interface CustomMapProps extends MapProps {
  id: string;
  /** A function that returns the map instance */
  children?: (map: MapboxMap) => React.ReactNode;

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

import { AnyLayer, AnySourceData } from 'mapbox-gl';

export type LngLat = { lng: number; lat: number };

export type Bbox = [number, number, number, number];

export type AnyLayerWithMetadata = AnyLayer & {
  metadata?: any;
};

export type Settings = {
  opacity: number;
  visibility: boolean;
  expand: boolean;
};

type OnAddRemoveProps = {
  source: AnySourceData;
  layers: AnyLayer[];
};

export type LayerProps = {
  id?: string;
  zIndex?: number;
  onAdd?: (props: OnAddRemoveProps) => void;
  onRemove?: (props: OnAddRemoveProps) => void;
};

export const LEGEND_TYPE = ['matrix', 'basic', 'choropleth', 'gradient'] as const;

export type LegendType = (typeof LEGEND_TYPE)[number];

export type Legend = {
  type: LegendType;
  title: string;
  info?: string;
  description?: string;
  items?: { color: string; value: string }[];
  intersections?: { id: number; color: string }[];
};

import { MapboxStyle } from 'react-map-gl';

interface SourceData {
  id: string;
  type: 'vector' | 'raster' | 'raster-dem' | 'geojson' | 'image' | 'video';
}

import { FormatProps } from '@/lib/utils/formats';

import type { Layer } from '@/types/generated/strapi.schemas';

export type Config = {
  source: SourceData;
  styles: MapboxStyle['layers'];
};

export type ParamsConfigValue = {
  key: string;
  default: unknown;
};

export type ParamsConfig = Record<string, ParamsConfigValue>[];

export type LegendConfig = {
  type: 'basic' | 'gradient' | 'choropleth';
  unit?: string;
  items: {
    value: string;
    color: string;
  }[];
};

export type InteractionConfig = {
  enabled: boolean;
  events: {
    type: 'click' | 'hover';
    values: {
      key: string;
      label: string;
      format?: FormatProps;
    }[];
  }[];
};

export type LayerProps = {
  id?: string;
  zIndex?: number;
  onAdd?: (props: Config) => void;
  onRemove?: (props: Config) => void;
};

export type LayerTyped = Layer & {
  config: Config;
  params_config: ParamsConfig;
  legend_config: LegendConfig;
  interaction_config: InteractionConfig;
  metadata: Record<string, unknown>;
};

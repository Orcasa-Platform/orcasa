import { AnySource } from 'react-map-gl';

import { MapStyle } from 'react-map-gl/maplibre';

import { FormatProps } from '@/lib/utils/formats';

import type { Layer } from '@/types/generated/strapi.schemas';

export type Config = {
  source: AnySource;
  styles: MapStyle['layers'];
};

export type ParamsConfigValue = {
  key: string;
  default: unknown;
};

export type ParamsConfig = ParamsConfigValue[];

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
      type?: 'string' | 'number';
      unit: string;
      format?: FormatProps;
    }[];
  }[];
  url?: string;
  layer?: string;
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

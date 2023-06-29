import type { AnyLayer, AnySourceData } from 'mapbox-gl';

import type { Layer } from '@/types/generated/strapi.schemas';

export type Config = {
  source: AnySourceData;
  styles: AnyLayer[];
};

export type ParamsConfig = Record<
  string,
  {
    key: string;
    default: unknown;
  }
>[];

export type LegendConfig = {
  type: string;
  items: {
    label: string;
    color: string;
  }[];
};

export type InteractionConfig = {
  enabled: boolean;
};

export type LayerProps = {
  id?: string;
  zIndex?: number;
  onAdd?: (props: Config) => void;
  onRemove?: (props: Config) => void;
};

export type MaboxLayer = Layer & {
  config: Config;
  params_config: ParamsConfig;
  legend_config: LegendConfig;
  interaction_config: InteractionConfig;
};

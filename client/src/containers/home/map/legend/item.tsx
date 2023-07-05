'use-client';
import { ReactElement, createElement, isValidElement, useMemo } from 'react';

import { parseConfig } from '@/lib/json-converter';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerTyped, LegendConfig } from '@/types/layers';
import { LegendType } from '@/types/map';

import LegendItem from '@/components/map/legend/item';
import {
  LegendTypeBasic,
  LegendTypeChoropleth,
  LegendTypeGradient,
} from '@/components/map/legend/item-types';
import { LegendItemProps, LegendTypeProps, SettingsManager } from '@/components/map/legend/types';
import ContentLoader from '@/components/ui/loader';

const LEGEND_TYPES: Record<LegendType, React.FC<LegendTypeProps>> = {
  basic: LegendTypeBasic,
  choropleth: LegendTypeChoropleth,
  gradient: LegendTypeGradient,
};

type MapLegendItemProps = LegendItemProps;

/** Check if the legend_config is valid and return the properties corresponding to the type */
const getLegendConfig = (legendConfig: unknown): LegendConfig | ReactElement | null => {
  if (!!legendConfig) {
    return parseConfig({ config: legendConfig, params_config: [], settings: {} });
  }
  return null;
};

const getSettingsManager = (data: LayerTyped = {} as LayerTyped): SettingsManager => {
  const { params_config, legend_config } = data;

  if (!params_config?.length) return {};
  const p = params_config.reduce((acc: Record<string, boolean>, { key }) => {
    if (!key) return acc;
    return {
      ...acc,
      [`${key}`]: true,
    };
  }, {});

  return {
    ...p,
    expand: !!legend_config && !!legend_config.type,
  };
};

const MapLegendItem = ({ id, ...props }: MapLegendItemProps) => {
  const { data, isError, isFetched, isFetching, isPlaceholderData } = useGetLayersId(id);

  const attributes = data?.data?.attributes as LayerTyped;
  const legend_config = attributes?.legend_config;
  const settingsManager = getSettingsManager(attributes);

  const LEGEND_COMPONENT = useMemo(() => {
    const l = getLegendConfig(legend_config);

    if (!l) return null;

    if (isValidElement(l)) {
      return l;
    }

    if (!isValidElement(l) && 'items' in l) {
      const { type, ...props } = l;
      return createElement(LEGEND_TYPES[type], props);
    }

    return null;
  }, [legend_config]);

  return (
    <ContentLoader
      skeletonClassName="h-10"
      data={data?.data}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      <LegendItem id={id} name={attributes?.title} settingsManager={settingsManager} {...props}>
        {LEGEND_COMPONENT}
      </LegendItem>
    </ContentLoader>
  );
};

export default MapLegendItem;

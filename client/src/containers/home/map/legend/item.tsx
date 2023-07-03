'use-client';
import { createElement, useMemo } from 'react';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponse } from '@/types/generated/strapi.schemas';
import { ParamsConfigValue } from '@/types/layers';
import { LEGEND_TYPE, Legend, LegendType } from '@/types/map';

import LegendItem from '@/components/map/legend/item';
import {
  LegendTypeBasic,
  LegendTypeChoropleth,
  LegendTypeGradient,
  LegendTypeMatrix,
} from '@/components/map/legend/item-types';
import {
  LegendItemProps,
  LegendMatrixIntersectionsProps,
  LegendTypeProps,
} from '@/components/map/legend/types';
import ContentLoader from '@/components/ui/loader';

const LEGEND_TYPES: Record<
  LegendType,
  React.FC<LegendTypeProps & LegendMatrixIntersectionsProps>
> = {
  basic: LegendTypeBasic,
  choropleth: LegendTypeChoropleth,
  gradient: LegendTypeGradient,
  matrix: LegendTypeMatrix,
};

type MapLegendItemProps = LegendItemProps;

/** Check if the legend_config is valid and return the properties corresponding to the type */
const getLegendConfig = (legendConfig: unknown) => {
  if (!!legendConfig) {
    const { type, items, intersections } = legendConfig as Legend;
    if (LEGEND_TYPE.includes(type) && items?.length) {
      if (type === 'matrix') {
        if (intersections?.length) {
          return {
            type,
            items,
            intersections,
          };
        }
      } else {
        return {
          type,
          items,
        };
      }
    }
  }
  return null;
};

const getParams = (data?: LayerResponse) => {
  const params_config = data?.data?.attributes?.params_config as ParamsConfigValue[];
  if (!params_config?.length) return {};
  const p = params_config.reduce((acc: Record<string, boolean>, { key }) => {
    if (!key) return acc;
    return {
      ...acc,
      [key]: true,
    };
  }, {});
  const legend_config = data?.data?.attributes?.legend_config as Legend;
  return {
    ...p,
    expand: !!legend_config && !!legend_config.type,
  };
};

const MapLegendItem = ({ id, ...props }: MapLegendItemProps) => {
  const { data, isError, isFetched, isFetching, isPlaceholderData } = useGetLayersId(id);
  const settingsManager = getParams(data);
  const attributes = data?.data?.attributes;
  const legend_config = attributes?.legend_config as Legend;

  const LEGEND_TYPE = useMemo(() => {
    const legendProps = getLegendConfig(legend_config);

    if (legendProps) {
      const { type, ...props } = legendProps;
      return createElement(
        LEGEND_TYPES[type],
        props as LegendTypeProps & LegendMatrixIntersectionsProps
      );
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
      <LegendItem
        id={id}
        {...props}
        name={attributes?.title}
        info={legend_config?.info}
        settingsManager={settingsManager}
      >
        {LEGEND_TYPE}
      </LegendItem>
    </ContentLoader>
  );
};

export default MapLegendItem;

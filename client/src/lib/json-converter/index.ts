/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';

import { JSONConfiguration, JSONConverter } from '@deck.gl/json';

import FUNCTIONS from '@/lib/utils';

import { ParamsConfig } from '@/types/layers';

import SoilsRevealedSettings from '@/containers/layer-groups-list/settings/sois-revealed-settings';
import TreeCoverLossSettings from '@/containers/layer-groups-list/settings/tree-cover-loss';

import {
  LegendTypeBasic,
  LegendTypeChoropleth,
  LegendTypeGradient,
} from '@/components/map/legend/item-types';

// import DecodeLayer only on client side
// As is not a react-component we can't use next/dynamic
let DecodeLayer;
export let JSON_CONFIGURATION: JSONConfiguration;

if (typeof window !== 'undefined') {
  import('@/components/map/layers/decode-layer')
    .then((module) => {
      DecodeLayer = module.default;
      // Move the JSON_CONFIGURATION inside the then() to ensure DecodeLayer is defined
      JSON_CONFIGURATION = new JSONConfiguration({
        React,
        classes: Object.assign({}, { DecodeLayer }),
        functions: FUNCTIONS,
        enumerations: {},
        reactComponents: {
          LegendTypeBasic,
          LegendTypeChoropleth,
          LegendTypeGradient,
          TreeCoverLossSettings,
          SoilsRevealedSettings,
        },
      });
    })
    .catch((error) => {
      console.error('Error loading DecodeLayer:', error);
    });
}

/**
 * *`getParams`*
 * Get params from params_config
 * @param {Object} params_config
 * @returns {Object} params
 *
 */
export interface GetParamsProps {
  settings: Record<string, unknown>;
  params_config: ParamsConfig;
}
export const getParams = ({ params_config, settings = {} }: GetParamsProps) => {
  if (!params_config) {
    return {};
  }
  return params_config.reduce((acc, p) => {
    return {
      ...acc,
      [`${p.key}`]: settings[`${p.key}`] ?? p.default,
    };
  }, {} as Record<string, unknown>);
};

/**
 * *`parseConfig`*
 * Parse config with params_config
 * @param {Object} config
 * @param {Object} params_config
 * @returns {Object} config
 *
 */
interface ParseConfigurationProps {
  config: unknown;
  params_config: unknown;
  settings: Record<string, unknown>;
  // We need to import the JSONConfiguration as we can only load it without SSR, when DecodeLayer is defined
  jsonConfiguration: JSONConfiguration;
}
export const parseConfig = <T>({
  config,
  params_config,
  settings,
  jsonConfiguration,
}: ParseConfigurationProps): T | null => {
  if (!config || !params_config) {
    return null;
  }

  const JSON_CONVERTER = new JSONConverter({
    configuration: jsonConfiguration,
  });

  const pc = params_config as ParamsConfig;
  const params = getParams({ params_config: pc, settings });
  // Merge enumerations with config

  if (!JSON_CONVERTER) {
    return null;
  }

  JSON_CONVERTER.mergeConfiguration({
    enumerations: {
      params,
    },
  });

  return JSON_CONVERTER.convert(config);
};

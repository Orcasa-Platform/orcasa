/* eslint-disable @typescript-eslint/no-var-requires */

import { JSONConverter } from '@deck.gl/json/typed';

/**
 * *`setOpacity`*
 * Set opacity
 * @param {Number} o
 * @param {Number} base
 * @returns {Number} opacity
 */
type SetOpacityProps = { o: number; base: number };
export const setOpacity = ({ o = 1, base = 1 }: SetOpacityProps) => {
  return o * base;
};

type SetVisibilityProps = { v: boolean };
export const setVisibility = ({ v = true }: SetVisibilityProps) => {
  return v;
};

export const JSON_CONFIGURATION = {
  layers: Object.assign(
    //
    {},
    require('@deck.gl/layers'),
    require('@deck.gl/aggregation-layers')
  ),
  functions: {
    setOpacity,
  },
  constants: {},
  enumerations: {},
};

/**
 * *`getParams`*
 * Get params from params_config
 * @param {Object} params_config
 * @returns {Object} params
 *
 */
export type ParamConfig = {
  key: string;
  default: unknown;
};
export interface GetParamsProps {
  params_config: ParamConfig[];
}
export const getParams = ({
  // settings
  params_config,
}: GetParamsProps) => {
  if (!params_config) {
    return {};
  }
  return params_config.reduce((acc, p) => {
    return {
      ...acc,
      [p.key]: p.default,
    };
  }, {});
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
}
export const parseConfig = <T>({ config, params_config }: ParseConfigurationProps): T => {
  const JSON_CONVERTER = new JSONConverter({
    configuration: JSON_CONFIGURATION,
  });

  const pc = params_config as ParamConfig[];
  const constants = getParams({ params_config: pc });

  // Merge constants with config
  JSON_CONVERTER.mergeConfiguration({
    constants,
  });
  return JSON_CONVERTER.convert(config);
};

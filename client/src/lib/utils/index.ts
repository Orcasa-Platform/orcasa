/**
 * Params should have this format => { key:'xxx', key2:'xxx' }
 * Keys to search should be in this format {{key}}
 *
 * @param {String} originalStr
 * @param {Object} params
 */

export type Params = Record<string, unknown>;

export const isObject = (value: unknown): boolean => {
  return typeof value === 'object' && value !== null && value.constructor === Object;
};

export const substitution = (originalStr: string, params: Params = {}): string => {
  let str = originalStr;

  Object.keys(params).forEach((key) => {
    const value = params[key] as string;

    if (Array.isArray(value) || isObject(value)) {
      str = str
        .replace(new RegExp(`"{{${key}}}"`, 'g'), JSON.stringify(value))
        .replace(new RegExp(`'{{${key}}}'`, 'g'), JSON.stringify(value))
        .replace(new RegExp(`\`{{${key}}}\``, 'g'), JSON.stringify(value));
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      str = str
        .replace(new RegExp(`"{{${key}}}"`, 'g'), value)
        .replace(new RegExp(`'{{${key}}}'`, 'g'), value)
        .replace(new RegExp(`\`{{${key}}}\``, 'g'), value);
    }

    str = str.replace(new RegExp(`{{${key}}}`, 'g'), value.toString());
  });
  return str;
};

/**
 * Replace function
 * @param {String, Object} string
 * @param {Object} params
 */
export const replace = <T = unknown | Record<string, unknown>>(
  value: T,
  params: Params = {}
): T => {
  const str = value;

  if (Array.isArray(value) || isObject(value)) {
    return JSON.parse(substitution(JSON.stringify(value), params));
  }

  if (typeof str === 'string') {
    return substitution(str, params) as T;
  }

  return str;
};

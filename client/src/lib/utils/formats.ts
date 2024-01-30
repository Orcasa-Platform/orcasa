export function formatPercentage(value: number, options?: Intl.NumberFormatOptions) {
  const formatter = Intl.NumberFormat('en-IE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    style: 'percent',
    ...options,
  });

  return formatter.format(value);
}

export function formatDate(value: string, options?: Intl.DateTimeFormatOptions) {
  const dateValue = new Date(value);
  if (isNaN(dateValue.getTime())) {
    // eslint-disable-next-line no-console
    console.warn('Date not valid', value);
    return value;
  }
  const formatter = Intl.DateTimeFormat('en-IE', {
    ...options,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return formatter.format(dateValue);
}

const formatNumber = (value: number) => {
  // The French number format uses spaces to separate thousands, millions, etc. and a comma to
  // separate the decimals e.g. 1 456 357,45
  const formatter = Intl.NumberFormat('fr');
  return formatter.format(value);
};

// Only to remove strange numbers. Maybe it can be fixed in data
const formatLayerNumber = (value: number) => {
  // The French number format uses spaces to separate thousands, millions, etc. and a comma to
  // separate the decimals e.g. 1 456 357,45
  const formatter = Intl.NumberFormat('fr');
  // To avoid strange behaviour in the map, we don't display numbers that too small
  if (Number.isNaN(value)) return null;
  if (value < -10000000) return null;
  return formatter.format(value);
};

const NUMBER_FORMATS = {
  formatPercentage,
  formatNumber,
  formatLayerNumber,
} as const;

const STRING_FORMATS = {
  formatDate,
} as const;

type NumberFormatId = keyof typeof NUMBER_FORMATS;
type StringFormatId = keyof typeof STRING_FORMATS;

export type FormatProps = {
  value: unknown;
  id: NumberFormatId | StringFormatId | undefined;
  options?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;
};

export function format({ id, value, options }: FormatProps) {
  const numberFn = NUMBER_FORMATS[id as NumberFormatId];
  const stringFn = STRING_FORMATS[id as StringFormatId];

  if (typeof numberFn === 'function' && typeof value === 'number') {
    return numberFn(value, options);
  }

  if (typeof stringFn === 'function' && typeof value === 'string') {
    return stringFn(value, options as Intl.DateTimeFormatOptions);
  }

  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  if (typeof value === 'string') {
    return value;
  }
}

const FORMATS = {
  ...STRING_FORMATS,
  ...NUMBER_FORMATS,
};

export default FORMATS;

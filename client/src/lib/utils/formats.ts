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

  return formatter.format(dateValue).replace(/\s/g, '/');
}

export function formatHA(value: number, options?: Intl.NumberFormatOptions) {
  const formatter = Intl.NumberFormat('en-IE', {
    notation: 'compact',
    compactDisplay: 'short',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    style: 'unit',
    unit: 'hectare',
    unitDisplay: 'short',
    ...options,
  });

  return formatter.format(value);
}

const NUMBER_FORMATS = {
  formatPercentage,
  formatHA,
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

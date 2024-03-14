import { useMapSettings } from '@/store/index';

type DefaultVariant = 'dark' | 'light';
type Variant = { [key: string]: DefaultVariant };

export function useTheme(): DefaultVariant;
export function useTheme(prefix?: string): DefaultVariant {
  const variants: { [key: string]: Variant } = {
    'basemap-light': {
      default: 'dark',
    },
    'basemap-relief': {
      default: 'dark',
    },
    'basemap-satellite': { default: 'light' },
  };
  const [{ basemap }] = useMapSettings();

  return variants[basemap ?? 'basemap-light'][prefix || 'default'];
}

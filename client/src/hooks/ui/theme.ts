import { useMapSettings } from '@/store/index';

type OpenerVariant = 'opener-dark' | 'opener-light';
type DefaultVariant = 'dark' | 'light';
type TextVariant = 'text-white' | 'text-black';
type Variant = { [key: string]: DefaultVariant | OpenerVariant | TextVariant };

export function useTheme(prefix: 'opener'): OpenerVariant;
export function useTheme(prefix: 'text'): TextVariant;
export function useTheme(): DefaultVariant;
export function useTheme(prefix?: string): DefaultVariant | OpenerVariant | TextVariant {
  const variants: { [key: string]: Variant } = {
    'basemap-light': {
      opener: 'opener-dark',
      text: 'text-black',
      default: 'dark',
    },
    'basemap-relief': {
      opener: 'opener-dark',
      text: 'text-black',
      default: 'dark',
    },
    'basemap-satellite': { opener: 'opener-light', text: 'text-white', default: 'light' },
  };
  const [{ basemap }] = useMapSettings();

  return variants[basemap ?? 'basemap-light'][prefix || 'default'];
}

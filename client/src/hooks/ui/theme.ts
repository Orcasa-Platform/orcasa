import { useRecoilValue } from 'recoil';

import { mapSettingsAtom } from '@/store/index';

type OpenerVariant = 'opener-dark' | 'opener-light';
type DefaultVariant = 'dark' | 'light';
type Variant = { [key: string]: DefaultVariant | OpenerVariant };

export function useTheme(prefix: 'opener'): OpenerVariant;
export function useTheme(): DefaultVariant;
export function useTheme(prefix?: string): DefaultVariant | OpenerVariant {
  const variants: { [key: string]: Variant } = {
    'basemap-light': {
      opener: 'opener-dark',
      default: 'dark',
    },
    'basemap-satellite': { opener: 'opener-light', default: 'light' },
  };
  const { basemap } = useRecoilValue(mapSettingsAtom);

  if (prefix === 'opener') {
    return variants[basemap].opener;
  }

  return variants[basemap].default;
}

import { useRecoilValue } from 'recoil';

import { mapSettingsAtom } from '@/store/index';

import { useTheme } from '@/hooks/ui/theme';

const Attribution = () => {
  const { basemap } = useRecoilValue(mapSettingsAtom);
  const theme = useTheme('text');
  const attributionLinkText = {
    'basemap-satellite': { text: 'ESRI', href: 'https://www.esri.com/home' },
    'basemap-light': { text: 'Carto', href: 'https://carto.com/' },
  }[basemap];

  const { text, href } = attributionLinkText || {};
  return (
    <div
      className={`absolute bottom-0 right-0 z-40 flex h-7 items-center justify-end gap-1 bg-gray-50/25 px-2 py-1 text-sm font-normal leading-tight ${theme}`}
    >
      <div>Powered by</div>
      <a className="hover:underline" rel="noopener noreferrer" target="_blank" href={href}>
        {text}
      </a>
    </div>
  );
};

export default Attribution;

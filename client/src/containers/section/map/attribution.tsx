import { useRecoilValue } from 'recoil';

import { mapSettingsAtom } from '@/store/index';

import { useTheme } from '@/hooks/ui/theme';

const Attribution = () => {
  const { basemap } = useRecoilValue(mapSettingsAtom);
  const theme = useTheme('text');
  const getAttributionContent = () => {
    if (basemap === 'basemap-satellite') {
      return (
        <>
          Tiles ©{' '}
          <a
            className="hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://esri.com"
          >
            Esri
          </a>{' '}
          — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP,
          and the GIS User Community
        </>
      );
    }
    if (basemap === 'basemap-light') {
      return (
        <>
          ©{' '}
          <a
            className="hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.openstreetmap.org/"
          >
            OpenStreetMap
          </a>{' '}
          contributors ©
          <a
            className="hover:underline"
            rel="noopener noreferrer"
            target="_blank"
            href="https://carto.com/"
          >
            CARTO
          </a>
        </>
      );
    }
    return null;
  };

  return (
    <div
      className={`absolute bottom-0 right-0 z-40 max-w-[400px] gap-1 bg-gray-50/25 px-2 py-1 text-sm leading-tight ${theme}`}
    >
      <span>Powered by</span> {getAttributionContent()}
    </div>
  );
};

export default Attribution;

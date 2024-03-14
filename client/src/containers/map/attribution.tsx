import { cn } from '@/lib/classnames';

import { useMapSettings } from '@/store/index';

const Attribution = () => {
  const [{ basemap }] = useMapSettings();
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

    if (basemap === 'basemap-relief') {
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
          — Source: Esri
        </>
      );
    }

    return null;
  };

  return (
    <div
      className={cn(
        'absolute bottom-0 right-0 z-40 max-w-[65%] gap-1 bg-gray-800 px-2 py-1 text-2xs leading-tight text-white',
      )}
    >
      {getAttributionContent()}
    </div>
  );
};

export default Attribution;

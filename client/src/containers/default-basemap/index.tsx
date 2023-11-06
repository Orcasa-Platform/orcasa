'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { usePreviousImmediate } from 'rooks';

import { useMapSettings } from '@/store';

import { getPages } from '@/types/generated/page';

// This component makes sure to set the correct default basemap for each module while respecting
// the eventual basemap stored in the URL on the first load.
// It must be inserted in the top-level layout so that it can compare the pathnames to identify when
// the user navigates from one module to another.
export default function DefaultBasemap() {
  const pathname = usePathname();
  const previousPathname = usePreviousImmediate(pathname);

  const basePathname = pathname !== null ? pathname.slice(1).split('/')[0] : null;
  const basePreviousPathname =
    previousPathname !== null ? previousPathname.slice(1).split('/')[0] : null;

  // When `basePreviousPathname` equals to `null`, it means that the user directly landed on the
  // page (without any client-side navigation)
  const isDirectAccess = basePreviousPathname === null;
  const hasChangedModule = basePathname !== basePreviousPathname && !isDirectAccess;

  const [mapSettings, setMapSettings] = useMapSettings();

  useEffect(() => {
    const updateBasemap = async () => {
      if (basePathname == null) {
        return;
      }

      const pages = await getPages({ filters: { slug: basePathname } });
      const defaultBasemap = pages?.data?.[0]?.attributes?.default_basemap;
      if (!defaultBasemap) {
        return;
      }

      setMapSettings((mapSettings) => ({
        ...mapSettings,
        basemap: defaultBasemap,
      }));
    };

    if (hasChangedModule || (isDirectAccess && !mapSettings.basemap)) {
      updateBasemap();
    }
  }, [isDirectAccess, hasChangedModule, basePathname, setMapSettings, mapSettings.basemap]);

  return null;
}

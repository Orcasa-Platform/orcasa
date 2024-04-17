'use client';

import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { usePreviousImmediate } from 'rooks';

import { useMapSettings } from '@/store';

import { getPages } from '@/types/generated/page';

// This component makes sure to set the correct default basemap, labels and boundaries for each
// module while respecting the eventual values stored in the URL on the first load.
// It must be inserted in the top-level layout so that it can compare the pathnames to identify when
// the user navigates from one module to another.
export default function DefaultMapSettings() {
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

    const updateLabels = async () => {
      if (basePathname == null) {
        return;
      }

      const pages = await getPages({ filters: { slug: basePathname } });
      const defaultLabels = pages?.data?.[0]?.attributes?.default_labels;
      if (!defaultLabels) {
        return;
      }

      setMapSettings((mapSettings) => ({
        ...mapSettings,
        labels: defaultLabels,
      }));
    };

    const updateBoundaries = async () => {
      if (basePathname == null) {
        return;
      }

      const pages = await getPages({ filters: { slug: basePathname } });
      const defaultBoudaries = pages?.data?.[0]?.attributes?.default_boundaries;
      if (!defaultBoudaries) {
        return;
      }

      setMapSettings((mapSettings) => ({
        ...mapSettings,
        boundaries: defaultBoudaries,
      }));
    };

    if (hasChangedModule || (isDirectAccess && !mapSettings.basemap)) {
      updateBasemap();
    }

    if (hasChangedModule || (isDirectAccess && !mapSettings.labels)) {
      updateLabels();
    }

    if (hasChangedModule || (isDirectAccess && !mapSettings.boundaries)) {
      updateBoundaries();
    }
  }, [isDirectAccess, hasChangedModule, basePathname, setMapSettings, mapSettings]);

  return null;
}

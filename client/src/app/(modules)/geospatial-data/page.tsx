'use client';

import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/layer-groups-list';

export default function GeospatialDataModule() {
  const pages = useGetPages({ filters: { slug: 'geospatial-data' } });
  const pageId = pages?.data?.data?.[0]?.id;

  if (!pageId) {
    return null;
  }

  return <LayerGroupsList pageId={pageId} />;
}

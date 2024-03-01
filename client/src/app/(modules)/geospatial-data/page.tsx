'use client';

import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/layer-groups-list';

import MarkdownRenderer from '@/components/home/markdown-renderer';

export default function GeospatialDataModule() {
  const pages = useGetPages({ filters: { slug: 'geospatial-data' } });
  const data = pages?.data?.data?.[0];
  const { id: pageId, attributes: { intro = undefined } = {} } = data || {};
  if (!pageId) {
    return null;
  }

  return (
    <>
      <h1 className="max-w-[372px] border-l-4 border-yellow-500 pl-5 font-serif text-lg leading-7">
        {intro && <MarkdownRenderer variant="bold" textClass="text-yellow-600" content={intro} />}
      </h1>
      <LayerGroupsList pageId={pageId} />
    </>
  );
}

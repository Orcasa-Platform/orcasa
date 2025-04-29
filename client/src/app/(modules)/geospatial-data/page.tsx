'use client';

import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/layer-groups-list';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import TutorialButton from '@/components/map/tutorial-button';
export default function GeospatialDataModule() {
  const pages = useGetPages({ filters: { slug: 'geospatial-data' } });
  const data = pages?.data?.data?.[0];
  const { id: pageId, attributes: { intro = undefined } = {} } = data || {};
  if (!pageId) {
    return null;
  }

  return (
    <>
      <h1 className="max-w-[372px] font-serif leading-7">
        {intro && <MarkdownRenderer variant="bold" content={intro} />}
      </h1>
      <TutorialButton href="https://vimeo.com/1060782020" />
      <LayerGroupsList pageId={pageId} />
    </>
  );
}

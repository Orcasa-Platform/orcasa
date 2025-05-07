'use client';

import { useRef } from 'react';

import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/layer-groups-list';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import InfoButton from '@/components/map/info-button';
import TutorialButton from '@/components/map/tutorial-button';

export default function GeospatialDataModule() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const pages = useGetPages({ filters: { slug: 'geospatial-data' } });
  const data = pages?.data?.data?.[0];
  const { id: pageId, attributes: { intro = undefined } = {} } = data || {};
  if (!pageId) {
    return null;
  }

  return (
    <div ref={containerRef} className="space-y-8">
      <h1 className="mb-2 max-w-[372px] font-serif leading-7">
        {intro && (
          <MarkdownRenderer
            variant="bold"
            content={intro}
            className="inline"
            markupClassName="inline"
          />
        )}
        <InfoButton container={containerRef}>
          This module explores a variety of data layers that provide insights into soil carbon
          stocks, types of land use, and changes in soil carbon over time. This module is designed
          to help policymakers, funders and researchers quickly identify areas of interest for
          further actions. Layers from external sources are automatically updated whenever the
          source updates them. Additionally, new layers will be occasionally added in Impact4Soil.
        </InfoButton>
      </h1>
      <TutorialButton href="https://vimeo.com/1060782020" />
      <LayerGroupsList pageId={pageId} />
    </div>
  );
}

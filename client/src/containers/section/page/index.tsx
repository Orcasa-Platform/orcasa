'use client';

import { Section } from '@/types/app';
import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/section/page/list';
import GeospatialDataPage from '@/containers/section/page/pages/geospatial-data';
import NetworkPage from '@/containers/section/page/pages/network';

export default function Page({ section }: { section: Section }) {
  const pages = useGetPages({ filters: { slug: section } });
  const pageId = pages?.data?.data?.[0]?.id;

  return (
    <div className="space-y-5 p-5 text-slate-700">
      {section === 'geospatial-data' && (
        <>
          <GeospatialDataPage />
          {pageId && <LayerGroupsList pageId={pageId} />}
        </>
      )}
      {section === 'network' && <NetworkPage />}
    </div>
  );
}

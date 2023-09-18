'use client';

import { Section } from '@/types/app';
import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/section/page/list';
import MapLayersPage from '@/containers/section/page/pages/map-layers';
import NetworkPage from '@/containers/section/page/pages/network';

export default function Page({ section }: { section: Section }) {
  const pages = useGetPages({ filters: { slug: section } });
  const pageId = pages?.data?.data?.[0]?.id;

  return (
    <div className="space-y-5 p-5 text-slate-700">
      {section === 'map-layers' && (
        <>
          <MapLayersPage />
          {pageId && <LayerGroupsList pageId={pageId} />}
        </>
      )}
      {section === 'network' && <NetworkPage />}
    </div>
  );
}

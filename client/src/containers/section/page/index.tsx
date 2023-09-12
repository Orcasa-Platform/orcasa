'use client';

import { Section } from '@/types/app';
import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/section/page/list';
import NetworkList from '@/containers/section/page/networks/network-list';

export default function Page({ section }: { section: Section }) {
  const pages = useGetPages({ filters: { slug: section } });
  const pageId = pages?.data?.data?.[0]?.id;
  return (
    <div className="space-y-5 p-5 text-slate-700">
      {section === 'map-layers' && (
        <>
          <h1 className="font-serif text-3.5xl">
            Identify <span className="font-semibold">areas of interest</span> for research or
            interventions.
          </h1>
          <p>
            Give context to your research visualising scientifically-reliable soil-related map
            layers.
          </p>
        </>
      )}
      {pageId && <LayerGroupsList pageId={pageId} />}
      {section === 'network' && (
        <>
          <h1 className="font-serif text-3.5xl">
            Discover <span className="font-semibold">who does what</span> on soils carbon.
          </h1>
          <NetworkList />
        </>
      )}
    </div>
  );
}

'use client';
import dynamic from 'next/dynamic';

import { useLayers } from '@/store';

import { useGetPages } from '@/types/generated/page';

import LayerGroupsList from '@/containers/layer-groups-list';

import MobileFooterMenu from '@/components/mobile-footer-menu';

const Legend = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});

export default function MobileFooter() {
  const pages = useGetPages({ filters: { slug: 'geospatial-data' } });
  const data = pages?.data?.data?.[0];
  const [layers] = useLayers();

  const { id: pageId } = data || {};
  if (!pageId) {
    return null;
  }

  return (
    <>
      <MobileFooterMenu
        buttons={[
          {
            label: 'Layers',
            count: layers?.length || 0,
            content: (
              <div className="overflow-auto">
                <LayerGroupsList pageId={pageId} />
              </div>
            ),
          },
          {
            label: 'Legend',
            content: layers?.length ? (
              <Legend isMobile />
            ) : (
              <div className="flex h-[130px] flex-col justify-center text-center text-gray-700">
                <div className="text-center font-serif text-xl leading-[30px]">
                  There isn&apos;t any layer active
                </div>
                <div className="text-sm leading-7">
                  Activate one or more layers to see their legend.
                </div>
              </div>
            ),
          },
        ]}
      />
    </>
  );
}

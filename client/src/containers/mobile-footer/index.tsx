'use client';
import dynamic from 'next/dynamic';

import { useLayers } from '@/store';

import { useGetPages } from '@/types/generated/page';

import NetworkFilters from '@/app/(modules)/network/(main)/(index)/filters-sidebar';
import PracticesFilters from '@/app/(modules)/practices/(main)/filters-sidebar';

import LayerGroupsList from '@/containers/layer-groups-list';

import MobileFooterMenu from '@/components/mobile-footer-menu';
const Legend = dynamic(() => import('@/containers/map/legend'), {
  ssr: false,
});

const geospatialButtons = ({
  pageId,
  layers,
}: {
  pageId: number;
  layers: ReturnType<typeof useLayers>[0];
}) => {
  return [
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
          <div className="text-sm leading-7">Activate one or more layers to see their legend.</div>
        </div>
      ),
    },
  ];
};

const practicesButtons = () => [
  {
    label: 'Filters',
    content: <PracticesFilters isMobile />,
  },
];

const networkButtons = () => [
  {
    label: 'Filters',
    content: <NetworkFilters isMobile />,
  },
];

type ButtonSection = 'geospatial-data' | 'practices' | 'network';

export default function MobileFooter({ section }: { section: ButtonSection }) {
  const pages = useGetPages({ filters: { slug: section } });
  const data = pages?.data?.data?.[0];
  const [layers] = useLayers();

  const { id: pageId } = data || {};
  if (!pageId) {
    return null;
  }
  const buttons = {
    'geospatial-data': geospatialButtons({ pageId, layers }),
    practices: practicesButtons(),
    network: networkButtons(),
  };

  const variants = {
    practices: 'dark',
    network: 'dark',
    'geospatial-data': 'light',
  };
  return (
    <>
      <MobileFooterMenu
        variant={variants[section] as 'dark' | 'light'}
        buttons={buttons[section]}
      />
    </>
  );
}

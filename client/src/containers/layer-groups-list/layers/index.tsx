'use client';

import dynamic from 'next/dynamic';

import type { LayerGroupLayers } from '@/types/generated/strapi.schemas';

const Layer = dynamic(() => import('./layer'), {
  ssr: false,
});

export default function Layers({ data }: { data: LayerGroupLayers | undefined }) {
  if (!data?.data) return null;
  return (
    <ul className="space-y-1">
      {data.data.map((l) => {
        if (!l.id || !l.attributes) return null;
        return <Layer key={l.id} {...l} />;
      })}
    </ul>
  );
}

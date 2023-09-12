'use client';

import type { LayerGroupLayers } from '@/types/generated/strapi.schemas';

import Layer from '@/containers/section/page/layers/layer';

export default function Layers({ data }: { data: LayerGroupLayers | undefined }) {
  return (
    <div>
      {data?.data && (
        <ul className="space-y-2">
          {data.data.map((l) => {
            if (!l.id || !l.attributes) return null;
            return <Layer key={l.id} {...l} />;
          })}
        </ul>
      )}
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';

import type {
  LayerGroupLayers,
  LayerGroupLayersDataItemAttributes,
} from '@/types/generated/strapi.schemas';

const Layer = dynamic(() => import('./layer'), {
  ssr: false,
});

export default function Layers({
  data,
  description,
}: {
  data: LayerGroupLayers | undefined;
  description: LayerGroupLayersDataItemAttributes['description'];
}) {
  return (
    <div>
      {data?.data && (
        <>
          {description && <p className="mb-8 text-base leading-6">{description}</p>}
          <ul className="space-y-4">
            {data.data.map((l) => {
              if (!l.id || !l.attributes) return null;
              return <Layer key={l.id} {...l} />;
            })}
          </ul>
        </>
      )}
    </div>
  );
}

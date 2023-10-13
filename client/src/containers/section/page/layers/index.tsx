'use client';

import type {
  LayerGroupLayers,
  LayerGroupLayersDataItemAttributes,
} from '@/types/generated/strapi.schemas';

import Layer from '@/containers/section/page/layers/layer';

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

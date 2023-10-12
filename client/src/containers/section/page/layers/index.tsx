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
        <ul>
          {description && <div className="mb-8 text-base leading-6">{description}</div>}
          {data.data.map((l) => {
            if (!l.id || !l.attributes) return null;
            return <Layer key={l.id} {...l} />;
          })}
        </ul>
      )}
    </div>
  );
}

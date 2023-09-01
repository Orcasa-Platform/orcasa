'use client';

import LayersList from '@/containers/section/datasets/layers/list';

export default function Layers({ datasetId }: { datasetId: number }) {
  return (
    <div>
      <LayersList datasetId={datasetId} />
    </div>
  );
}

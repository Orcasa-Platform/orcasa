'use client';

import DatasetsList from '@/containers/home/datasets/list';

export default function Datasets() {
  return (
    <div className="space-y-5 p-5">
      <h2 className="text-3xl">Datasets</h2>

      <DatasetsList />
    </div>
  );
}

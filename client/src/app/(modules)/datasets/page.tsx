'use client';

import { useGetDatasetsInfinite } from '@/hooks/datasets';

import DatasetList from './dataset-list';

export default function DatasetsModule() {
  const query = useGetDatasetsInfinite({ size: 20 });

  return <DatasetList {...query} />;
}

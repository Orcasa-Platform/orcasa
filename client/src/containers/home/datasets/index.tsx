'use client';

import { useGetDatasetGroups } from '@serverless-app-scaffold/types/generated/dataset-group';

export default function Datasets() {
  const { data: datasetGroupsData } = useGetDatasetGroups();
  console.log(datasetGroupsData);

  return (
    <main className="absolute">
      <div className="h-screen w-screen"></div>
    </main>
  );
}

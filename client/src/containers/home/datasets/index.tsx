'use client';

import { useGetDatasets } from '@serverless-app-scaffold/types/generated/dataset';

import env from '@/env.mjs';

export default function Datasets() {
  const { data: datasetData } = useGetDatasets(
    {
      populate: '*',
    },
    {
      axios: {
        baseURL: env.NEXT_PUBLIC_API_URL,
      },
    }
  );

  console.info({
    datasetData,
  });

  return (
    <main className="absolute">
      <div className="h-screen w-screen"></div>
    </main>
  );
}

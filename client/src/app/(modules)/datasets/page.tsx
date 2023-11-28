'use client';

import Image from 'next/image';

import { useGetDatasetsInfinite } from '@/hooks/datasets';

import { sourceToLogo } from './dataset';
import DatasetList from './dataset-list';

export default function DatasetsModule() {
  const query = useGetDatasetsInfinite({ size: 20 });

  return (
    <>
      <h1 className="border-l-4 border-purple-700 pl-5 font-serif text-lg leading-[30px]">
        Explore an extensive{' '}
        <span className="font-semibold text-purple-700">collection of SOC datasets</span> from
        trusted sources, all in one place.
      </h1>
      <div className="mt-14 flex flex-wrap items-center justify-end gap-10">
        {Object.entries(sourceToLogo).map(([source, { src, alt, width, height }]) => (
          <Image key={source} src={src} alt={alt} width={width} height={height} />
        ))}
      </div>
      <div className="mt-14 border-t border-dashed border-t-gray-200 py-6">
        {!!query.data && query.data.pages.length > 0 && (
          <p className="text-sm text-gray-500">
            Showing {query.data.pages[0].meta.total_records} datasets.
          </p>
        )}
      </div>
      <DatasetList {...query} />
    </>
  );
}

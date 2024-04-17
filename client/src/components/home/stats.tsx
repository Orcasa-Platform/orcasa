import dynamic from 'next/dynamic';

import { cn } from '@/lib/classnames';

import { getPractices } from '@/types/generated/practice';
import { getProjects } from '@/types/generated/project';

import { getDatasets } from '@/hooks/datasets';
import { getScientificEvidenceMockStats } from '@/hooks/scientific-evidence';

const Counter = dynamic(() => import('./counter'), {
  ssr: false,
});

export default async function Stats({ className }: { className: string }) {
  const data: { title: string; value?: number }[] = [
    {
      title: 'Meta-analysis',
      value: (await getScientificEvidenceMockStats())?.all?.metaAnalysis || 0,
    },
    {
      title: 'Initiatives',
      value:
        (await getProjects({ fields: ['id'], 'pagination[pageSize]': 1 })).meta?.pagination
          ?.total || 0,
    },
    {
      title: 'Datasets',
      value: (await getDatasets({ size: 1 })).meta?.total_records || 0,
    },
    {
      title: 'Practices',
      value:
        (await getPractices({ fields: ['id'], 'pagination[pageSize]': 1 })).meta?.pagination
          ?.total || 0,
    },
  ];

  return (
    <div className={cn('flex overflow-hidden rounded-lg drop-shadow-2xl', className)}>
      {data.map(({ title, value }) => (
        <div
          key={title}
          className="flex w-[110px] flex-col items-center justify-center gap-2 border border-white border-l-gray-50 bg-white px-3 py-3 text-gray-700"
        >
          <div className="min-h-[28px] text-center font-serif text-xl">
            {value && <Counter value={value} />}
          </div>
          <div className="h-1 w-4 rounded bg-yellow-500" />
          <div className="text-center text-xs font-normal">{title}</div>
        </div>
      ))}
    </div>
  );
}

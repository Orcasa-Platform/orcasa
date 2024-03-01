import { cn } from '@/lib/classnames';

import { getPractices } from '@/types/generated/practice';
import { getProjects } from '@/types/generated/project';

import { getDatasets } from '@/hooks/datasets';
import { getScientificEvidenceMockStats } from '@/hooks/scientific-evidence';

import Counter from './counter';

export default async function Stats({ className }: { className: string }) {
  const data: { title: string; class: string; value?: number }[] = [
    {
      title: 'Meta-analysis',
      value: (await getScientificEvidenceMockStats()).all?.metaAnalysis || 0,
      class: 'bg-green-700',
    },
    {
      title: 'Initiatives',
      value:
        (await getProjects({ fields: ['id'], 'pagination[pageSize]': 1 })).meta?.pagination
          ?.total || 0,
      class: 'bg-blue-500',
    },
    {
      title: 'Datasets',
      value: (await getDatasets({ size: 1 })).meta?.total_records || 0,
      class: 'bg-purple-700',
    },
    {
      title: 'Practices',
      value:
        (await getPractices({ fields: ['id'], 'pagination[pageSize]': 1 })).meta?.pagination
          ?.total || 0,
      class: 'bg-brown-500',
    },
  ];

  return (
    <div className={cn('flex drop-shadow-2xl', className)}>
      {data.map(({ title, value, class: itemClassName }) => (
        <div
          key={title}
          className="flex w-[110px] flex-col items-center justify-center gap-2 border border-l-gray-50 bg-white px-3 py-3 text-gray-500"
        >
          <div className="min-h-[28px] text-center font-serif text-xl">
            {value && <Counter value={value} />}
          </div>
          <div className={cn('h-1 w-4', itemClassName)} />
          <div className="text-center text-xs font-normal">{title}</div>
        </div>
      ))}
    </div>
  );
}

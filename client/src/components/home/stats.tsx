import { cn } from '@/lib/classnames';

import { getHomeStats } from '@/types/generated/home-stat';

export default async function Stats({ className }: { className: string }) {
  const data = await getHomeStats({ populate: '*' });
  const stats = data?.data?.map((item) => ({
    title: item?.attributes?.title,
    value: item?.attributes?.value,
    class: item?.attributes?.class,
  }));
  if (!data || !stats) return null;

  if (!stats) return null;
  return (
    <div className={cn('flex drop-shadow-2xl', className)}>
      {stats.map(({ title, value, class: itemClassName }) => (
        <div
          key={title}
          className="flex w-[110px] flex-col items-center justify-center gap-2 border border-l-gray-50 bg-white px-3 py-3 text-gray-500"
        >
          <div className="text-center font-serif text-xl">{value}</div>
          <div className={cn('h-1 w-4', itemClassName)} />
          <div className="text-center text-xs font-normal">{title}</div>
        </div>
      ))}
    </div>
  );
}

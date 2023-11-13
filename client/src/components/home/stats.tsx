import { cn } from '@/lib/classnames';

import { HomeStat } from '@/types/generated/strapi.schemas';
const Stats = ({ stats, className }: { stats: HomeStat[]; className: string }) => {
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
};

export default Stats;

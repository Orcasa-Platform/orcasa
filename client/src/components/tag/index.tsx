import { cn } from '@/lib/classnames';

const Tag = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        'flex max-w-[200px] items-center rounded-2xl border border-green-700 px-2 py-0.5 text-2xs font-medium text-green-700',
        className,
      )}
    >
      {children}
    </div>
  );
};

export default Tag;

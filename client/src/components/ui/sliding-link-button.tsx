import React from 'react';

import Link from 'next/link';

import { cn } from '@/lib/classnames';

const SlidingLinkButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> & {
    buttonClassName?: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    position?: 'left' | 'right' | undefined;
    isCompact?: boolean;
  }
>(
  (
    { children, className, buttonClassName, Icon, position = 'left', isCompact = false, ...props },
    ref,
  ) => {
    return (
      <>
        <Link
          className={cn(
            'group flex items-center justify-start',
            { 'flex-row-reverse': position === 'right' },
            className,
          )}
          ref={ref}
          {...props}
        >
          <Icon
            className={cn({
              'mr-[15px] h-[34px] w-[34px] bg-gray-100 px-1 py-1 transition-colors group-hover:bg-slate-700 group-hover:text-white group-focus:bg-slate-700 group-focus:text-white':
                true,
              [buttonClassName ?? '']: !!buttonClassName,
            })}
          />
          <span
            className={cn('text-xs opacity-0 transition group-focus:opacity-100', {
              'min-w-fit duration-500 group-hover:opacity-100': !isCompact,
              'max-w-0 duration-0 group-hover:max-w-fit group-hover:opacity-100 group-hover:duration-500':
                isCompact,
              '-translate-x-1/3 group-hover:translate-x-0 group-focus:translate-x-0':
                position === 'left',
              'translate-x-0 group-hover:-translate-x-1/3 group-focus:-translate-x-1/3':
                position === 'right',
            })}
          >
            {children}
          </span>
        </Link>
      </>
    );
  },
);

SlidingLinkButton.displayName = 'SlidingLinkButton';

export { SlidingLinkButton };

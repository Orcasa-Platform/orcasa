import React from 'react';

import Link from 'next/link';

import { cva, type VariantProps } from 'class-variance-authority';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/classnames';

const buttonVariants = cva(
  'mr-[15px] h-[32px] w-[32px] rounded-lg px-2 transition-colors group-hover:bg-green-700 group-hover:text-white group-focus:bg-green-700 group-focus:text-white',
  {
    variants: {
      variant: {
        default: 'bg-gray-100',
        dark: 'bg-gray-300',
      },
      defaultVariants: {
        variant: 'default',
      },
    },
  },
);

const SlidingLinkButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof Link> &
    VariantProps<typeof buttonVariants> & {
      buttonClassName?: string;
      Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> | LucideIcon;
      position?: 'left' | 'right' | undefined;
      isCompact?: boolean;
    }
>(
  (
    {
      children,
      className,
      buttonClassName,
      Icon,
      position = 'left',
      variant = 'default',
      isCompact = false,
      ...props
    },
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
            className={cn(buttonVariants({ variant }), {
              [buttonClassName ?? '']: !!buttonClassName,
            })}
          />
          <span
            className={cn(
              'text-xs opacity-0 transition group-hover:opacity-100 group-focus:opacity-100',
              {
                'min-w-fit duration-500': !isCompact,
                'max-w-0 duration-0 group-hover:max-w-fit group-hover:duration-500 group-focus:max-w-fit group-focus:duration-500':
                  isCompact,
                '-translate-x-1/3 group-hover:translate-x-0 group-focus:translate-x-0':
                  position === 'left',
                'translate-x-0 group-hover:-translate-x-1/4 group-focus:-translate-x-1/4':
                  position === 'right',
              },
            )}
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

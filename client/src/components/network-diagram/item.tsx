import { useRef } from 'react';

import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useMapSearchParams } from '@/store';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import type { Category } from '@/hooks/networks/utils';
import { useIsOverTwoLines } from '@/hooks/ui/utils';

import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

import Document from '@/styles/icons/document.svg';

type PathProps = {
  heightIndex: number;
  category: Category;
  isGranchild: boolean | undefined;
  isFirstOfType: boolean | undefined;
};

const Path = ({ heightIndex, category, isGranchild = false, isFirstOfType = false }: PathProps) => {
  if (typeof heightIndex === 'undefined') return null;

  const ITEM_HEIGHT = 90;
  const PADDING = 40;
  const additionalHeight = isFirstOfType ? 20 : 0;
  const topHeight = heightIndex * ITEM_HEIGHT + additionalHeight;
  // Allow some padding to show the full width of the strokes
  const STROKE_PADDING = 2;

  const pathProps = {
    strokeWidth: category === 'coordinator' ? 3 : 1,
    strokeDasharray: category === 'funder' ? '3' : '0',
  };

  return (
    <>
      <svg
        height={`${PADDING + topHeight}px`}
        width="25"
        className="absolute -left-6 fill-transparent stroke-primary"
        style={{
          top: `-${topHeight}px`,
        }}
      >
        <path
          d={`M${STROKE_PADDING},${isGranchild ? topHeight - ITEM_HEIGHT : '0'}
          L${STROKE_PADDING},${topHeight + 20}`}
          {...pathProps}
        />
        <path
          d={`M${STROKE_PADDING},${topHeight + 20} Q${STROKE_PADDING},${PADDING + topHeight} 25,
        ${PADDING + topHeight - STROKE_PADDING}`}
          {...pathProps}
        />
      </svg>
    </>
  );
};

type ItemProps = Pick<Project | Organization, 'name'> & {
  id: number;
  type: 'organization' | 'project';
  category?: Category;
  opened?: boolean;
  onToggle?: (opened: boolean) => void;
  heightIndex?: number;
  hasChildren: boolean;
  isFirstOfType?: boolean;
};
const Item = ({
  name,
  id,
  type,
  category,
  opened = false,
  onToggle,
  heightIndex,
  hasChildren,
  isFirstOfType,
}: ItemProps) => {
  const isFirstNode = !category;
  const isGranchild = category && !onToggle;
  const searchParams = useMapSearchParams();

  const toggleOpenCollapsible = () => {
    onToggle?.(opened);
  };
  const ref = useRef<HTMLDivElement>(null);
  const isOverTwoLines = useIsOverTwoLines(ref, true);

  return (
    <div className="relative -mt-6 w-full">
      {/* DOT */}
      {((isFirstNode && hasChildren) || (hasChildren && category && opened)) && (
        <span
          className="absolute left-[14px] h-2 w-2 rounded-full bg-black"
          style={{ top: 'calc(100% - 4px)' }}
        />
      )}
      {/* PATH */}
      {!isFirstNode && typeof heightIndex !== 'undefined' && (
        <Path
          heightIndex={heightIndex}
          category={category}
          isGranchild={isGranchild}
          isFirstOfType={isFirstOfType}
        />
      )}
      {/* CONTENT */}
      <div
        className={cn('mt-10 flex h-20 w-fit min-w-full items-center justify-between gap-8 p-4', {
          'border border-slate-700': isFirstNode || opened,
          'bg-blue-50': type === 'organization',
          'bg-peach-50': type === 'project',
        })}
      >
        <div
          className={cn('text-sm text-slate-700', {
            'line-clamp-2': isOverTwoLines,
          })}
          ref={ref}
          {...(isOverTwoLines ? { title: name } : {})}
        >
          {name}
        </div>
        {category && (
          <div className="flex min-w-fit items-center gap-4">
            <SlidingLinkButton
              isCompact
              buttonClassName={cn('p-0 m-0', {
                'bg-blue-100': type === 'organization',
                'bg-peach-100': type === 'project',
              })}
              href={`/network/${type}/${id}?${searchParams.toString()}`}
              position="right"
              Icon={Document}
            >
              Learn more
            </SlidingLinkButton>
            {typeof onToggle !== 'undefined' && hasChildren && (
              <CollapsibleTrigger onClick={toggleOpenCollapsible}>
                <ChevronDown
                  className={cn('transform transition-transform', {
                    'rotate-180': opened,
                  })}
                />
              </CollapsibleTrigger>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;

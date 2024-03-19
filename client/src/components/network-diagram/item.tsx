import { useRef } from 'react';

import Link from 'next/link';

import { ChevronDown } from 'lucide-react';
import CoordinatorLetter from 'public/images/network-links/coordinator.svg';
import FunderLetter from 'public/images/network-links/funder.svg';
import PartnerLetter from 'public/images/network-links/partner.svg';

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
  isGranchild?: boolean;
  hasDot?: boolean;
};

const Path = ({ heightIndex, category, isGranchild = false, hasDot = false }: PathProps) => {
  if (typeof heightIndex === 'undefined') return null;

  // Padding to place the path at the middle of the item
  const PADDING = 45;
  const ITEM_HEIGHT = 70;
  // Additional height to take into account the space between the items
  const additionalHeight = heightIndex * 25;
  const topHeight = (heightIndex + 1) * ITEM_HEIGHT + additionalHeight;

  // Allow some padding to show the full circle
  const CIRCLE_PADDING = 10;
  // Allow some padding to show the full width of the strokes
  const STROKE_PADDING = 2;

  const pathProps = {
    strokeWidth: '2',
    strokeDasharray: category === 'funder' ? '4' : '0',
  };
  const circleColorClass = category === 'partner' ? 'text-gray-300' : 'text-gray-700';
  const Letter =
    category === 'coordinator'
      ? CoordinatorLetter
      : category === 'funder'
      ? FunderLetter
      : PartnerLetter;
  return (
    <>
      {hasDot && (
        <span
          className="dot absolute left-[14px] z-20 h-2 w-2 rounded-full bg-black"
          style={{ top: 'calc(100% - 4px)' }}
        />
      )}
      <svg
        height={`${PADDING + topHeight + CIRCLE_PADDING}px`}
        width="40"
        className="absolute -left-10 z-10 fill-transparent stroke-primary"
        style={{
          top: `-${topHeight}px`,
        }}
      >
        <path
          d={`M${STROKE_PADDING},${
            isGranchild ? topHeight - ITEM_HEIGHT : '0'
          } L${STROKE_PADDING},${topHeight + 25}`}
          className={cn('stroke-current', circleColorClass)}
          {...pathProps}
        />
        <path
          d={`M${STROKE_PADDING},${topHeight + 25} Q${STROKE_PADDING},${PADDING + topHeight} 50,
          ${PADDING + topHeight - STROKE_PADDING}`}
          className={cn('stroke-current', circleColorClass)}
          {...pathProps}
        />
        <g transform={`translate(20, ${PADDING + topHeight - STROKE_PADDING})`}>
          <circle
            cx="4"
            cy="0"
            r="8"
            className={cn('fill-current stroke-none', circleColorClass)}
          />
          <g transform="translate(1, -3.5)">
            <Letter />
          </g>
        </g>
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
  isFirst?: boolean;
  hasDot?: boolean;
  className?: string;
  style?: React.CSSProperties;
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
  hasDot,
  className,
  style,
}: ItemProps) => {
  const isFirstNode = !category;
  const isGranchild = category && !onToggle;
  const searchParams = useMapSearchParams();

  const toggleOpenCollapsible = () => {
    onToggle?.(opened);
  };
  const ref = useRef<HTMLAnchorElement>(null);
  const isOverTwoLines = useIsOverTwoLines(ref, true);
  const canExpandWithChildren = typeof onToggle !== 'undefined' && hasChildren;
  const canExpandWithoutChildren = typeof onToggle !== 'undefined' && !hasChildren;
  return (
    <div className={cn('relative -mt-6 w-full', className)} style={style}>
      {/* PATH */}
      {!isFirstNode && typeof heightIndex !== 'undefined' && (
        <Path
          heightIndex={heightIndex}
          category={category}
          isGranchild={isGranchild}
          hasDot={(isFirstNode && hasChildren) || (hasChildren && category && opened)}
        />
      )}
      {hasDot && (
        <span
          className="absolute left-[14px] z-20 h-2 w-2 rounded-full bg-black"
          style={{ top: 'calc(100% - 4px)' }}
        />
      )}
      {/* CONTENT */}
      <div
        className={cn('mt-10 flex h-20 w-fit min-w-full items-center justify-between gap-6 p-4', {
          'border border-slate-700': isFirstNode || opened,
          'bg-blue-50': type === 'organization',
          'bg-peach-50': type === 'project',
        })}
      >
        <Link
          className={cn('text-sm text-slate-700', {
            'line-clamp-2': isOverTwoLines,
          })}
          href={`/network/${
            type === 'project' ? 'initiative' : type
          }/${id}?${searchParams.toString()}`}
          ref={ref}
          {...(isOverTwoLines ? { title: name } : {})}
        >
          {name}
        </Link>
        {category && (
          <div className="flex min-w-fit max-w-fit items-center gap-4">
            <SlidingLinkButton
              isCompact
              buttonClassName={cn('p-0 m-0', {
                'bg-blue-100': type === 'organization',
                'bg-peach-100': type === 'project',
                // Compensate for the missing button
                'mr-10': canExpandWithoutChildren,
              })}
              href={`/network/${
                type === 'project' ? 'initiative' : type
              }/${id}?${searchParams.toString()}`}
              position="right"
              Icon={Document}
            >
              Learn more
            </SlidingLinkButton>
            {canExpandWithChildren && (
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

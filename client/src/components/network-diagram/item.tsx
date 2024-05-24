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

import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import Active from '@/styles/icons/initiative-active.svg';
import Finished from '@/styles/icons/initiative-finished.svg';
import NotStarted from '@/styles/icons/initiative-not-started.svg';

type PathProps = {
  heightIndex: number;
  category: Category;
  isGranchild?: boolean;
};

const Path = ({ heightIndex, category, isGranchild = false }: PathProps) => {
  if (typeof heightIndex === 'undefined') return null;

  const WIDTH = 40;
  const ITEM_HEIGHT = 56;
  const ITEM_GAP = 24;
  const CIRCLE_RADIUS = 8;
  const STROKE_WIDTH = 2;
  const CURVE_PADDING = 8;

  // The vertical path is higher if the previous item is expanded. This offset increases the height
  // of the svg element and push the curve and the circle to the bottom.
  const verticalOffset =
    !isGranchild && heightIndex > 0 ? heightIndex * (ITEM_HEIGHT + ITEM_GAP) : 0;

  const pathProps = {
    strokeWidth: '2',
    strokeDasharray: category === 'funder' ? '4' : '0',
  };

  const circleColorClass = category === 'coordinator' ? 'text-white' : 'text-gray-500';

  const Letter =
    category === 'coordinator'
      ? CoordinatorLetter
      : category === 'funder'
      ? FunderLetter
      : PartnerLetter;

  return (
    <>
      <svg
        height={`${ITEM_GAP + (ITEM_HEIGHT * 3) / 2 + CIRCLE_RADIUS + verticalOffset}px`}
        width={WIDTH}
        className="absolute -left-10 z-10 fill-transparent stroke-primary"
        style={{ top: `${-1 * (ITEM_GAP + ITEM_HEIGHT + verticalOffset)}px` }}
      >
        <path
          d={`M ${STROKE_WIDTH / 2} 0 v ${ITEM_GAP + ITEM_HEIGHT + verticalOffset}`}
          className={cn('stroke-current', circleColorClass)}
          {...pathProps}
        />
        <path
          d={`M ${STROKE_WIDTH / 2} ${ITEM_GAP + ITEM_HEIGHT + verticalOffset} v ${
            CURVE_PADDING / 2
          } Q ${STROKE_WIDTH / 2} ${ITEM_GAP + (ITEM_HEIGHT * 3) / 2 + verticalOffset} ${
            WIDTH - CURVE_PADDING
          } ${ITEM_GAP + (ITEM_HEIGHT * 3) / 2 + verticalOffset} h ${
            CIRCLE_RADIUS + CURVE_PADDING
          }`}
          className={cn('stroke-current', circleColorClass)}
          {...pathProps}
        />
        <g
          transform={`translate(${WIDTH - CURVE_PADDING - CIRCLE_RADIUS}, ${
            ITEM_GAP + (ITEM_HEIGHT * 3) / 2 + verticalOffset
          })`}
        >
          <circle
            cx="0"
            cy="0"
            r={CIRCLE_RADIUS}
            className={cn('fill-current stroke-none', circleColorClass)}
          />
          <g transform="translate(-3, -3.5)">
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
  status?: 'active' | 'finished' | 'not-started';
  category?: Category;
  opened?: boolean;
  onToggle?: (opened: boolean) => void;
  heightIndex?: number;
  hasChildren: boolean;
  isFirst?: boolean;
  className?: string;
  style?: React.CSSProperties;
};
const Item = ({
  name,
  id,
  type,
  status,
  category,
  opened = false,
  onToggle,
  heightIndex,
  hasChildren,
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
  const canExpandWithChildren = typeof onToggle !== 'undefined' && hasChildren;

  return (
    <div className={cn('relative w-full', className)} style={style}>
      {/* PATH */}
      {!isFirstNode && typeof heightIndex !== 'undefined' && (
        <Path heightIndex={heightIndex} category={category} isGranchild={isGranchild} />
      )}
      {/* CONTENT */}
      <div
        className={cn(
          'group mt-6 flex h-14 w-fit min-w-full items-center justify-between gap-6 rounded-lg px-4 py-2',
          {
            'bg-gray-650 text-gray-200': type === 'organization',
            'bg-purple-500 text-white': type === 'project',
            'bg-green-700 text-white': type === 'organization' && isFirstNode,
          },
        )}
      >
        <div className="flex items-center gap-2">
          {!isFirstNode && type === 'project' && status === 'active' && (
            <Active className="h-4 w-4 shrink-0" />
          )}
          {!isFirstNode && type === 'project' && status === 'finished' && (
            <Finished className="h-4 w-4 shrink-0" />
          )}
          {!isFirstNode && type === 'project' && status === 'not-started' && (
            <NotStarted className="h-4 w-4 shrink-0" />
          )}
          <Link
            className="line-clamp-2 text-sm"
            href={`/network/${
              type === 'project' ? 'initiative' : type
            }/${id}?${searchParams.toString()}`}
            ref={ref}
            title={name}
          >
            {name}
          </Link>
        </div>
        {category && (
          <div className="min-w-fit max-w-fit items-center gap-4 group-hover:flex lg:hidden">
            <Button
              asChild
              variant="outline-dark"
              size="sm"
              className="hidden border-white/25 bg-transparent hover:bg-white/5 focus-visible:bg-white/5 lg:flex"
            >
              <Link
                href={`/network/${
                  type === 'project' ? 'initiative' : type
                }/${id}?${searchParams.toString()}`}
              >
                See details
              </Link>
            </Button>

            {canExpandWithChildren && (
              <CollapsibleTrigger asChild onClick={toggleOpenCollapsible}>
                <Button
                  variant="outline-dark"
                  size="icon"
                  className="border-white/25 bg-transparent hover:bg-white/5 focus-visible:bg-white/5 group-hover:inline-flex lg:hidden"
                >
                  <span className="sr-only">Expand/collapse</span>
                  <ChevronDown
                    className={cn(' h-4 w-4 transform transition-transform', {
                      'rotate-180': opened,
                    })}
                  />
                </Button>
              </CollapsibleTrigger>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;

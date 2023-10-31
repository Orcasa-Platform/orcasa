import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import { Category } from '@/hooks/networks';

import { SlidingLinkButton } from '../ui/sliding-link-button';

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
  const END_LINE_PADDING = 2;

  const pathProps = {
    stroke: 'black',
    strokeWidth: category === 'coordinator' ? 3 : 1,
    strokeDasharray: category === 'funder' ? '3' : '0',
    fill: 'transparent',
  };

  return (
    <>
      <svg
        height={`${PADDING + topHeight}px`}
        width="25"
        className={`absolute -left-6`}
        style={{
          top: `-${topHeight}px`,
        }}
      >
        <path
          d={`M0,${isGranchild ? topHeight - ITEM_HEIGHT : '0'} L0,${topHeight + 20}`}
          {...pathProps}
        />
        <path
          d={`M0,${topHeight + 20} Q0,${PADDING + topHeight} 25,
        ${PADDING + topHeight - END_LINE_PADDING}`}
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
  openCollapsibles?: number[];
  setOpenCollapsibles?: React.Dispatch<React.SetStateAction<number[]>>;
  heightIndex?: number;
  hasChildren: boolean;
  isFirstOfType?: boolean;
};
const Item = ({
  name,
  id,
  type,
  category,
  openCollapsibles,
  setOpenCollapsibles,
  heightIndex,
  hasChildren,
  isFirstOfType,
}: ItemProps) => {
  const isFirstNode = !category;
  const isGranchild = category && !setOpenCollapsibles;
  const toggleOpenCollapsible = () => {
    if (setOpenCollapsibles === undefined) return;
    if (openCollapsibles?.includes(id)) {
      setOpenCollapsibles(openCollapsibles.filter((i) => i !== id));
    } else {
      setOpenCollapsibles([...(openCollapsibles || []), id]);
    }
  };

  return (
    <div className="relative -mt-6">
      {/* DOT */}
      {((isFirstNode && hasChildren) ||
        (hasChildren && category && openCollapsibles?.includes(id))) && (
          <span
            className="absolute left-[12.5px] h-2 w-2 rounded-full bg-black"
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
        className={cn('mt-10 flex h-20 w-[450px] items-center justify-between gap-4 p-4', {
          'border border-slate-700': isFirstNode || openCollapsibles?.includes(id),
          'bg-blue-50': type === 'organization',
          'bg-peach-50': type === 'project',
        })}
      >
        <div className="text-sm text-slate-700">{name}</div>
        {category && (
          <div className="flex min-w-fit items-center gap-4">
            <SlidingLinkButton
              buttonClassName={cn('bg-blue-100 p-0 m-0', {
                'bg-blue-100': type === 'organization',
                'bg-peach-100': type === 'project',
              })}
              href={`/network/${type}/${id}`}
              position="right"
              Icon={Document}
            >
              Learn more
            </SlidingLinkButton>
            {typeof setOpenCollapsibles !== 'undefined' && hasChildren && (
              <CollapsibleTrigger onClick={toggleOpenCollapsible}>
                <ChevronDown
                  className={cn('transform transition-transform', {
                    'rotate-180': openCollapsibles?.includes(id),
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

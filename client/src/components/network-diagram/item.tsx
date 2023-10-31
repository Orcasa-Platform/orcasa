import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import { Category } from '@/hooks/networks';

import { SlidingLinkButton } from '../ui/sliding-link-button';

import Document from '@/styles/icons/document.svg';

const renderPath = (index: number, category: Category, isGranchild = false) => {
  if (typeof index === 'undefined') return null;
  const ITEM_HEIGHT = 100;
  const PADDING = 40;
  const topHeight = index * ITEM_HEIGHT;
  const pathProps = {
    stroke: 'black',
    strokeWidth: category === 'coordinator' ? 3.5 : 1.5,
    strokeDasharray: category === 'funder' ? '4' : '0',
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
          d={
            !isGranchild ? `M0,0 L0,${topHeight}` : `M0,${topHeight - ITEM_HEIGHT} L0,${topHeight}`
          }
          {...pathProps}
        />
        <path
          d={`M0,${topHeight} Q0,${PADDING + topHeight} 30,
        ${PADDING + topHeight}`}
          {...pathProps}
        />
      </svg>
    </>
  );
};

const Item = ({
  name,
  id,
  type,
  category,
  openCollapsibles,
  setOpenCollapsibles,
  index,
  hasChildren,
}: Pick<Project | Organization, 'name'> & {
  id: number;
  type: 'organization' | 'project';
  category?: Category;
  openCollapsibles?: number[];
  setOpenCollapsibles?: React.Dispatch<React.SetStateAction<number[]>>;
  index?: number;
  hasChildren: boolean;
}) => {
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
      {!isFirstNode && typeof index !== 'undefined' && renderPath(index, category, isGranchild)}
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
              href={`/network/project/${id}`}
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

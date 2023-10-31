'use client';
import React, { useState } from 'react';

import { CollapsibleContent, Collapsible, CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import { useNetworkDiagram, Category } from '@/hooks/networks';

import { SlidingLinkButton } from '../ui/sliding-link-button';

import Document from '@/styles/icons/document.svg';

const Element = ({
  name,
  id,
  type,
  category,
  openCollapsibles,
  setOpenCollapsibles,
}: Pick<Project | Organization, 'name'> & {
  id: number;
  type: 'organization' | 'project';
  category: Category;
  openCollapsibles: number[];
  setOpenCollapsibles: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  const toggleOpenCollapsible = () => {
    if (openCollapsibles.includes(id)) {
      setOpenCollapsibles(openCollapsibles.filter((i) => i !== id));
    } else {
      setOpenCollapsibles([...openCollapsibles, id]);
    }
  };
  const index = 1;
  return (
    <div className="relative -mt-6">
      {category && (
        <svg height={`${index * 20}px`} width="8" className="absolute -top-4 left-0">
          <path
            d={`M0,0 Q0,${index * 10} 10,${index * 20}`}
            stroke="black"
            stroke-width={category === 'coordinator' ? 2 : 1}
            strokeDasharray={category === 'funder' ? '4' : '0'}
            fill="transparent"
          />
        </svg>
      )}
      <div
        className={cn(
          'mt-10 flex h-20 w-[450px] items-center justify-between gap-4 border border-slate-700 p-4',
          {
            'bg-blue-50': type === 'organization',
            'bg-peach-50': type === 'project',
          },
        )}
      >
        <div className="text-sm text-slate-700">{name}</div>
        {category && (
          <div className="flex items-center gap-4">
            <SlidingLinkButton
              buttonClassName={cn('bg-blue-100 p-0 m-0', {
                'bg-blue-100': type === 'organization',
                'bg-peach-100': type === 'project',
              })}
              href={`/project/${id}`}
              position="right"
              Icon={Document}
            >
              Learn more
            </SlidingLinkButton>
            {!!setOpenCollapsibles && (
              <CollapsibleTrigger onClick={toggleOpenCollapsible}>
                <ChevronDown
                  className={cn('transform transition-transform', {
                    'rotate-180': openCollapsibles.includes(id),
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

const NetworkDiagram = ({
  data,
  id,
  type,
}: {
  data: Project | Organization;
  id: number;
  type: 'project' | 'organization';
}) => {
  const { name } = data;

  const [openCollapsibles, setOpenCollapsibles] = useState<number[]>([]);
  const { data: networks, isError, isFetched } = useNetworkDiagram({ type, id });
  if (isFetched && isError) {
    return null;
  }
  return (
    <div>
      <div className="my-6 border-t border-dashed border-t-gray-200" />
      <div className="mb-6 font-serif text-2xl text-slate-700">Network</div>
      <div className="flex gap-2">
        <div>
          <Element name={name} id={id} type={type} />
          {networks.map((network) => {
            if (!network || typeof network?.name === 'undefined') {
              return null;
            }
            return (
              <Collapsible key={network?.id}>
                <Element
                  key={network?.id}
                  {...network}
                  setOpenCollapsibles={setOpenCollapsibles}
                  openCollapsibles={openCollapsibles}
                />
                <CollapsibleContent>
                  <div className="ml-10">
                    {network?.children.map((child) => (
                      <Element key={child?.id} {...child} />
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
        <div className="flex h-fit w-[165px] flex-col gap-2 border border-dashed border-gray-300 p-6 text-slate-700">
          <div className="flex items-center gap-2">
            <span className="h-[3px] w-6 bg-gray-700" />
            <span>Coordinator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 border-t border-gray-700" />
            <span>Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 border-t border-dashed border-gray-700" />
            <span>Funder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagram;

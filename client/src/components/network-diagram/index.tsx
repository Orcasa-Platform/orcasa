'use client';
import React, { useState } from 'react';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import { useNetworkDiagram } from '@/hooks/networks';

import { CollapsibleContent, Collapsible } from '@/components/ui/collapsible';

import Item from './item';

const handleOnToggle = (
  opened: boolean,
  id: number | undefined,
  setOpenCollapsibles: React.Dispatch<React.SetStateAction<number[]>>,
) => {
  setOpenCollapsibles((collapsibles) => {
    if (opened) {
      return collapsibles.filter((collapsibleId) => collapsibleId !== id);
    }
    return id ? [...collapsibles, id] : collapsibles;
  });
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
  const {
    data: networks,
    isError,
    isFetched,
  } = useNetworkDiagram({
    type,
    id,
  });

  if (isFetched && isError) {
    return null;
  }

  const getIndex = (childIndex: number) => {
    const previousItem = networks[childIndex + 1]; // + 1 as the order is reversed
    const isPreviousItemOpened =
      previousItem?.id !== undefined && openCollapsibles.includes(previousItem.id);
    const childIndexOffset = isPreviousItemOpened ? previousItem?.children?.length || 0 : 0;
    return childIndexOffset || 0;
  };

  return (
    <div>
      <div className="my-6 border-t border-dashed border-t-gray-200" />
      <div className="mb-6 font-serif text-2xl text-slate-700">Network</div>
      <div className="flex flex-col-reverse justify-between gap-4 xl:flex-row">
        <div className="-mt-4 flex-grow overflow-hidden">
          <Item
            name={name}
            id={id}
            type={type}
            hasChildren={networks?.length > 0}
            hasDot={networks?.length > 0}
            className="z-40"
          />
          {
            networks
              .reverse() // We reverse the array to correct the z-index of the svgs
              .map((network, childIndex) => {
                if (
                  !network ||
                  typeof network === 'undefined' ||
                  typeof network.name === 'undefined' ||
                  typeof network.id === 'undefined'
                ) {
                  return null;
                }
                return (
                  <Collapsible key={network.id} className="ml-14">
                    <Item
                      key={network.id}
                      name={network.name}
                      type={network.type as 'organization' | 'project'}
                      category={network.category}
                      id={network.id}
                      onToggle={(open) => handleOnToggle(open, network.id, setOpenCollapsibles)}
                      opened={openCollapsibles.includes(network.id)}
                      heightIndex={getIndex(childIndex)}
                      hasChildren={network?.children?.length > 0}
                      className="z-30"
                    />
                    <CollapsibleContent className="ml-14">
                      {network?.children
                        .reverse()
                        .map(
                          (child, grandChildIndex) =>
                            child &&
                            typeof child.id !== 'undefined' && (
                              <Item
                                key={child?.id}
                                name={child.name}
                                type={child.type as 'organization' | 'project'}
                                category={child.category}
                                id={child?.id}
                                heightIndex={grandChildIndex}
                                hasChildren={false}
                                className="z-20"
                              />
                            ),
                        )}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
              .reverse() // We reverse it again to have the same order as the original array
          }
        </div>
        <div className="flex h-fit w-[165px] flex-col gap-2 border border-dashed border-gray-200 p-6 text-slate-700">
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

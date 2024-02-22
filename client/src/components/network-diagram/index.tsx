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
    // We reverse the array and use + 1 instead of - 1 to get the original order
    const previousItem = [...networks].reverse()[childIndex + 1];
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
            [...networks]
              .reverse() // We reverse the array to correct the z-index of the svgs
              .map((network, childIndex) => {
                if (
                  !network ||
                  typeof network.name === 'undefined' ||
                  typeof network.id === 'undefined'
                ) {
                  return null;
                }

                return (
                  <Collapsible
                    key={network.id}
                    className="relative ml-14"
                    // We use the z-index to make sure each path is above the following one
                    style={{ zIndex: 30 + childIndex }}
                  >
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
                      {
                        [...network.children]
                          .reverse() // We reverse the array to correct the z-index of the svgs
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
                          )
                          .reverse()
                        // We reverse it again to have the same order as the original array
                      }
                    </CollapsibleContent>
                  </Collapsible>
                );
              })
              .reverse() // We reverse it again to have the same order as the original array
          }
        </div>
        <div className="flex h-fit w-[177px] flex-col gap-2 border border-dashed border-gray-200 p-4 text-slate-700">
          <div className="relative flex items-center gap-2">
            <span className="h-[3px] w-10 bg-gray-700" />
            <span className="min-w-5 absolute left-2.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs text-white">
              C
            </span>
            <span>Coordinator</span>
          </div>
          <div className="relative flex items-center gap-2">
            <span className="h-[3px] w-10 bg-gray-300" />
            <span className="min-w-5 absolute left-2.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-300 text-xs text-white">
              P
            </span>
            <span>Partner</span>
          </div>
          <div className="relative flex items-center gap-2">
            <span className="relative h-[3px] w-10 border-t-2 border-dashed border-gray-700" />
            <span className="min-w-5 absolute left-2.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-xs text-white">
              F
            </span>
            <span>Funder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDiagram;

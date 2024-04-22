'use client';
import React, { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import { useNetworkDiagram } from '@/hooks/networks';

import { Button } from '@/components/ui/button';
import { CollapsibleContent, Collapsible, CollapsibleTrigger } from '@/components/ui/collapsible';

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
  const [expanded, setExpanded] = useState(true);
  const [openCollapsibles, setOpenCollapsibles] = useState<number[]>([]);

  const { name } = data;

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
    <Collapsible
      className="border-y border-gray-600 py-8"
      open={expanded}
      onOpenChange={setExpanded}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl">Network</h2>
        <CollapsibleTrigger className="group" asChild>
          <Button
            size="icon"
            className="!bg-gray-500 hover:!bg-green-700 focus-visible:!bg-green-700 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-700"
          >
            <span className="sr-only">Expand/collapse the network</span>
            <ChevronDown className="h-4 w-4 transform transition-transform group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="mt-6 flex flex-col-reverse justify-between gap-8 empty:mt-0">
        <div className="flex-grow overflow-hidden">
          <Item
            name={name}
            id={id}
            type={type}
            hasChildren={networks?.length > 0}
            className="-mt-6"
            style={{ zIndex: 20 + networks.length }}
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
                    style={{ zIndex: 20 + childIndex }}
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
                      className="mt-0"
                      style={{ zIndex: 20 + childIndex }}
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
                                  style={{
                                    zIndex:
                                      20 + childIndex + grandChildIndex - network.children.length,
                                  }}
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
        <div className="flex gap-6 text-xs text-gray-200">
          <div className="flex items-center gap-2">
            <span className="relative h-0 w-10 border-t-2 border-white">
              <span className="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-2xs text-gray-800">
                C
              </span>
            </span>
            <span>Coordinator</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative h-0 w-10 border-t-2 border-gray-500">
              <span className="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-500 text-2xs text-white">
                P
              </span>
            </span>
            <span>Partner</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative h-0 w-10 border-t-2 border-dashed border-gray-500">
              <span className="absolute left-1/2 top-1/2 flex h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gray-500 text-2xs text-white">
                F
              </span>
            </span>
            <span>Funder</span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default NetworkDiagram;

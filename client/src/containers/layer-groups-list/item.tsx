'use client';

import { useState } from 'react';

import Info from '/public/images/info.svg?unoptimized';

import { LayerGroupListResponseDataItem } from '@/types/generated/strapi.schemas';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipArrow, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import Layers from './layers';

export default function LayerGroupItem(props: Required<LayerGroupListResponseDataItem>) {
  const { id, attributes } = props || {};
  const { layers, description, title } = attributes || {};
  const [infoOpen, setInfoOpen] = useState(false);
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`${id}`}
      className="w-full rounded-lg bg-white p-4"
    >
      <AccordionItem key={props.id} value={`${id}`}>
        <div className="flex w-full items-center justify-between">
          <AccordionTrigger level={2} className="text-xs font-medium uppercase text-gray-800">
            {title}
          </AccordionTrigger>
          {description && (
            <Tooltip delayDuration={0} open={infoOpen} onOpenChange={setInfoOpen}>
              <TooltipTrigger asChild onClick={() => setInfoOpen(!infoOpen)}>
                <Button variant="vanilla" size="auto" className="mr-2 rounded-full text-gray-800">
                  <span className="sr-only">Info button</span>
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent variant="dark" className="max-w-[270px]">
                {description}
                <TooltipArrow variant="dark" />
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <AccordionContent>
          <Layers data={layers} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

'use client';

import { LayerGroupListResponseDataItem } from '@/types/generated/strapi.schemas';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import Layers from './layers';

export default function LayerGroupItem(props: Required<LayerGroupListResponseDataItem>) {
  const { id, attributes } = props || {};
  const { layers, description, title } = attributes || {};
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={`${id}`}
      className="w-full rounded-lg bg-white p-4"
    >
      <AccordionItem key={props.id} value={`${id}`}>
        <AccordionTrigger className="text-[10px] uppercase text-gray-800">{title}</AccordionTrigger>
        <AccordionContent>
          <Layers data={layers} description={description} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

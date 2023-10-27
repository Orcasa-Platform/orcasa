'use client';

import { LayerGroupListResponseDataItem } from '@/types/generated/strapi.schemas';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import Layers from './layers';

export default function DatasetsItem(props: Required<LayerGroupListResponseDataItem>) {
  const { id, attributes } = props || {};
  const { layers, description, title } = attributes || {};
  return (
    <div>
      <Accordion type="single" collapsible defaultValue={`${id}`} className="w-full">
        <AccordionItem key={props.id} value={`${id}`}>
          <AccordionTrigger className="text-left font-serif text-2xl">{title}</AccordionTrigger>
          <AccordionContent>
            <Layers data={layers} description={description} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

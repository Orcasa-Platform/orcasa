'use client';

import { LayerGroupListResponseDataItem } from '@/types/generated/strapi.schemas';

import Layers from '@/containers/section/page/layers';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function DatasetsItem(props: Required<LayerGroupListResponseDataItem>) {
  const { id, attributes } = props || {};
  return (
    <div>
      <Accordion type="single" collapsible defaultValue={`${id}`} className="w-full">
        <AccordionItem key={props.id} value={`${id}`}>
          <AccordionTrigger>{attributes.title}</AccordionTrigger>
          <AccordionContent>
            <Layers data={attributes.layers} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

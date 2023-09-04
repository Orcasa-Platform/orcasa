'use client';

import { DatasetListResponseDataItem } from '@/types/generated/strapi.schemas';

import Layers from '@/containers/section/datasets/layers';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function DatasetsItem(props: Required<DatasetListResponseDataItem>) {
  return (
    <div>
      <Accordion type="single" collapsible defaultValue={`${props.id}`} className="w-full">
        <AccordionItem key={props.id} value={`${props.id}`}>
          <AccordionTrigger className="text-base">{props.attributes.title}</AccordionTrigger>

          <AccordionContent>
            <Layers datasetId={props.id} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

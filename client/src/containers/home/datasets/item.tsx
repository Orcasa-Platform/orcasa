'use client';

import { DatasetListResponseDataItem } from '@/types/generated/strapi.schemas';

import Layers from '@/containers/home/datasets/layers';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function DatasetsItem(props: Required<DatasetListResponseDataItem>) {
  return (
    <div>
      <h3 className="text-base"></h3>

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

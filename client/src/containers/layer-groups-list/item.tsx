'use client';

import Info from 'public/images/info.svg';

import { LayerGroupListResponseDataItem } from '@/types/generated/strapi.schemas';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

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
        <div className="flex w-full justify-between">
          <AccordionTrigger className="text-xs uppercase text-gray-800">{title}</AccordionTrigger>
          {description && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="vanilla" size="auto" className="-mt-3 mr-2">
                  <span className="sr-only">Info button</span>
                  <Info className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
                {description}
              </DialogContent>
            </Dialog>
          )}
        </div>
        <AccordionContent>
          <Layers data={layers} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

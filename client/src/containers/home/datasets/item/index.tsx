'use client';
import { useMemo } from 'react';

import { DatasetListResponseDataItem } from '@/types/generated/strapi.schemas';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';

export default function DatasetsItem(props: DatasetListResponseDataItem) {
  const LAYERS = useMemo(() => {
    return [
      ...(props?.attributes?.mapbox_layers?.data ? props?.attributes?.mapbox_layers?.data : []),
      ...(props?.attributes?.deckgl_layers?.data ? props?.attributes?.deckgl_layers?.data : []),
    ];
  }, [props?.attributes?.mapbox_layers, props?.attributes?.deckgl_layers]);

  return (
    <div>
      <h3 className="text-base"></h3>

      <Accordion type="single" collapsible defaultValue={`${props?.id}`} className="w-full">
        <AccordionItem key={props?.id} value={`${props?.id}`}>
          <AccordionTrigger className="text-base">{props?.attributes?.title}</AccordionTrigger>

          <AccordionContent>
            <ul>
              {LAYERS.map((l) => {
                return (
                  <li key={l.id} className="space-between flex space-x-2.5">
                    <h4>{l?.attributes?.title}</h4>
                    <Switch
                      className="shrink-0"
                      onCheckedChange={(c) => {
                        console.info('onCheckedChange', c);
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

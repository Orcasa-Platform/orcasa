'use client';

import { useDatasetsGroups } from '@/hooks/datasets';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import DatasetsItem from './item';

export default function Datasets() {
  const { groups } = useDatasetsGroups();

  return (
    <div className="space-y-5 p-5">
      <h2 className="text-3xl">Datasets</h2>

      <Accordion type="multiple" defaultValue={groups.map((g) => g.key)} className="w-full">
        {groups.map((g) => {
          return (
            <AccordionItem key={g.key} value={g.key}>
              <AccordionTrigger className="text-xl">{g.key}</AccordionTrigger>
              <AccordionContent>
                {g.value.map((d) => {
                  return <DatasetsItem key={d.id} {...d} />;
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

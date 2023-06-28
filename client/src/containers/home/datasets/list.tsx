'use client';

import { DatasetListResponseDataItem } from '@/types/generated/strapi.schemas';

import { useDatasetsGroups } from '@/hooks/datasets';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import ContentLoader from '@/components/ui/loader';

import DatasetsItem from './item';

export default function DatasetsList() {
  const { groups, isFetching, isFetched, isPlaceholderData, isError } = useDatasetsGroups();

  return (
    <ContentLoader
      data={groups}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      <Accordion type="multiple" className="w-full" defaultValue={groups.map((g) => g.key)}>
        {groups.map((g) => {
          return (
            <AccordionItem key={g.key} value={g.key}>
              <AccordionTrigger className="text-xl">{g.key}</AccordionTrigger>
              <AccordionContent>
                {g.value.map((d) => {
                  if (!d.id || !d.attributes) return null;
                  return (
                    <DatasetsItem key={d.id} {...(d as Required<DatasetListResponseDataItem>)} />
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </ContentLoader>
  );
}

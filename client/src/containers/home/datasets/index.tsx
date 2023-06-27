'use client';

import { useState } from 'react';

import { useGetDatasets } from '@serverless-app-scaffold/types/generated/dataset';
import { ChevronLeft } from 'lucide-react';

import env from '@/env.mjs';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';

export default function Datasets() {
  const [open, setOpen] = useState(true);
  const { data: datasetData } = useGetDatasets(
    {
      populate: '*',
    },
    {
      axios: {
        baseURL: env.NEXT_PUBLIC_API_URL,
      },
    }
  );

  return (
    <div
      className={cn({
        'absolute left-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-white transition-transform duration-500':
          true,
        'translate-x-0': open,
        '-translate-x-full': !open,
      })}
    >
      <div className="absolute left-full top-6 z-10">
        <Button
          variant="default"
          size="icon"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ChevronLeft
            className={cn({
              'h-6 w-6 transition-transform': true,
              'rotate-180': !open,
            })}
          />
        </Button>
      </div>

      <div className="prose flex grow flex-col overflow-y-auto">
        <h2>Datasets</h2>

        <ul>
          {datasetData?.data?.data?.map((dataset) => {
            return (
              <li key={dataset.id}>
                <h3>{dataset.attributes?.title}</h3>
                <p>{dataset.attributes?.publishedAt}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

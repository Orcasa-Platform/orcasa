import Image from 'next/image';

import { ArrowRight } from 'lucide-react';
import striptags from 'striptags';

import { format } from '@/lib/utils/formats';

import { Dataset, DatasetListResponseDataItem, DatasetSource } from '@/types/datasets';

import { Button } from '@/components/ui/button';
import CalendarIcon from '@/styles/icons/calendar.svg';

const sourceToLogo: Record<
  DatasetSource,
  { src: string; alt: string; width: number; height: number }
> = {
  CIRAD: {
    src: '/assets/logos/cirad.svg',
    alt: 'CIRAD',
    width: 85,
    height: 32,
  },
  HARVARD: {
    src: '/assets/logos/harvard.svg',
    alt: 'Harvard University',
    width: 101,
    height: 25,
  },
  INRAE: {
    src: '/assets/logos/inrae.svg',
    alt: 'INRAE',
    width: 86,
    height: 19,
  },
  JRC: {
    src: '/assets/logos/jrc.svg',
    alt: 'Joint Research Centre',
    width: 86,
    height: 59,
  },
  ZENODO: {
    src: '/assets/logos/zenodo.svg',
    alt: 'Zenodo',
    width: 86,
    height: 25,
  },
};

const Icons = ({ source, publication_date }: Omit<Dataset, '_id'>) => {
  return (
    <div className="relative flex flex-wrap gap-x-4 gap-y-2">
      <div className="flex gap-2">
        <CalendarIcon className="h-6 w-6 min-w-min" />
        <div className="text-base text-slate-500">
          {format({ id: 'formatDate', value: publication_date })}
        </div>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image className="absolute right-0 top-0" {...sourceToLogo[source]} />
      </div>
    </div>
  );
};

export default function Dataset({ _id, ...attributes }: DatasetListResponseDataItem) {
  const { title, authors, short_description, url, doi } = attributes;

  return (
    <li key={_id} className="mb-2 flex min-h-[240px] w-full gap-4 bg-gray-50">
      <div className="flex w-full flex-col justify-between gap-6 px-12 py-10 text-base text-slate-500">
        <header className="flex flex-col gap-6">
          <Icons {...attributes} />
          <div className="font-serif text-2xl leading-10">{title}</div>
          {!!authors && <p>{Array.isArray(authors) ? authors.join(', ') : authors}</p>}
          <p
            className="line-clamp-2"
            // Even if the content is not HTML anymore after the tags have been stripped, there are
            // still characters such as `&apos;` in the text
            dangerouslySetInnerHTML={{ __html: striptags(short_description) }}
          />
        </header>
        <div className="flex items-center justify-end gap-x-4">
          {!!doi && (
            <Button
              variant="vanilla"
              size="auto"
              className="gap-x-1 text-base font-semibold text-purple-700"
              asChild
            >
              <a href={`https://doi.org/${doi?.replace('doi:', '')}`} target="_blank">
                DOI
                <ArrowRight />
              </a>
            </Button>
          )}
          <Button
            variant="vanilla"
            size="auto"
            className="gap-x-1 text-base font-semibold text-purple-700"
            asChild
          >
            <a href={url} target="_blank">
              Access dataset
              <ArrowRight />
            </a>
          </Button>
        </div>
      </div>
    </li>
  );
}

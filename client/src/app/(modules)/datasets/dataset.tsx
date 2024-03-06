import Image from 'next/image';

import { ExternalLink } from 'lucide-react';
import striptags from 'striptags';

import { format } from '@/lib/utils/formats';

import { Dataset, DatasetListResponseDataItem, DatasetSource } from '@/types/datasets';

import { Button } from '@/components/ui/button';
import InfoTooltip from '@/components/ui/info-tooltip';
import CalendarIcon from '@/styles/icons/calendar.svg';

export const sourceToLogo: Record<
  DatasetSource,
  { src: string; alt: string; width: number; height: number }
> = {
  INRAE: {
    src: '/assets/logos/inrae.svg',
    alt: 'INRAE',
    width: 54,
    height: 12,
  },
  CIRAD: {
    src: '/assets/logos/cirad.svg',
    alt: 'CIRAD',
    width: 64,
    height: 24,
  },
  HARVARD: {
    src: '/assets/logos/harvard.svg',
    alt: 'Harvard University',
    width: 81,
    height: 20,
  },
  ZENODO: {
    src: '/assets/logos/zenodo.svg',
    alt: 'Zenodo',
    width: 55,
    height: 16,
  },
  JRC: {
    src: '/assets/logos/jrc.svg',
    alt: 'Joint Research Centre',
    width: 97,
    height: 24,
  },
};

const Icons = ({ source, publication_date }: Omit<Dataset, '_id'>) => {
  return (
    <div className="relative flex flex-wrap gap-x-4 gap-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-700">
        <CalendarIcon className="h-6 w-6 min-w-min" />
        {format({ id: 'formatDate', value: publication_date })}
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image className="absolute right-0 top-0" {...sourceToLogo[source]} />
      </div>
    </div>
  );
};

export default function Dataset({ _id, ...attributes }: DatasetListResponseDataItem) {
  const { title, authors, short_description, url, doi } = attributes;
  return (
    <li key={_id} className="mb-2 flex min-h-[240px] w-full bg-gray-50">
      <div className="flex w-full flex-col justify-between gap-4 p-6 text-base text-gray-700">
        <header className="flex flex-col gap-4">
          <Icons {...attributes} />
          <div className="font-serif text-lg">{title}</div>
          {!!authors && authors.length > 0 && (
            <InfoTooltip
              triggerContent={Array.isArray(authors) ? authors.join(', ') : authors}
              content={
                <p className="text-xs italic">
                  {Array.isArray(authors) ? authors.join(', ') : authors}
                </p>
              }
              className="max-w-[450px]"
              triggerClassName="line-clamp-1 max-w-fit cursor-pointer text-left text-xs italic"
            />
          )}
          <p
            className="mt-4 line-clamp-2 text-sm text-gray-500"
            // Even if the content is not HTML anymore after the tags have been stripped, there are
            // still characters such as `&apos;` in the text
            dangerouslySetInnerHTML={{ __html: striptags(short_description) }}
          />
        </header>
        <div className="mt-1 flex items-center justify-end gap-x-4">
          {!!doi && (
            <Button className="gap-x-4 text-base" asChild>
              <a href={`https://doi.org/${doi?.replace('doi:', '')}`} target="_blank">
                DOI
                <ExternalLink />
              </a>
            </Button>
          )}
          <Button className="gap-x-4 text-base" asChild>
            <a href={url} target="_blank">
              Dataset
              <ExternalLink />
            </a>
          </Button>
        </div>
      </div>
    </li>
  );
}

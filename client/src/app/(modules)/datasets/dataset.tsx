import Image from 'next/image';

import { ExternalLink } from 'lucide-react';
import striptags from 'striptags';

import { format } from '@/lib/utils/formats';

import type { Dataset, DatasetListResponseDataItem, DatasetSource } from '@/types/datasets';

import Tag from '@/components/tag';
import { Button } from '@/components/ui/button';
import InfoTooltip from '@/components/ui/info-tooltip';

const sourceToLogo: Record<
  DatasetSource,
  { src: string; alt: string; width: number; height: number }
> = {
  INRAE: {
    src: '/assets/logos/color/inrae.svg',
    alt: 'INRAE',
    width: 54,
    height: 12,
  },
  CIRAD: {
    src: '/assets/logos/color/cirad.svg',
    alt: 'CIRAD',
    width: 64,
    height: 24,
  },
  HARVARD: {
    src: '/assets/logos/color/harvard.svg',
    alt: 'Harvard University',
    width: 81,
    height: 20,
  },
  ZENODO: {
    src: '/assets/logos/color/zenodo.svg',
    alt: 'Zenodo',
    width: 55,
    height: 16,
  },
  JRC: {
    src: '/assets/logos/color/jrc.svg',
    alt: 'Joint Research Centre',
    width: 62,
    height: 28,
  },
};

const Icons = ({ source, publication_date }: Omit<Dataset, '_id'>) => {
  return (
    <div className="relative flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-700">
      <Tag>{format({ id: 'formatDate', value: publication_date })}</Tag>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image className="absolute right-0 top-0" {...sourceToLogo[source]} />
    </div>
  );
};

export default function Dataset({ _id, ...attributes }: DatasetListResponseDataItem) {
  const { title, authors, short_description, url, doi } = attributes;
  return (
    <li key={_id} className="flex min-h-[240px] w-full rounded-lg bg-gray-50">
      <div className="flex w-full flex-col justify-between gap-6 p-6 text-base text-gray-700">
        <header className="flex flex-col gap-4">
          <div className="space-y-6">
            <Icons {...attributes} />
            <div className="font-serif text-base leading-relaxed">{title}</div>
          </div>
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
            className="line-clamp-2 text-xs leading-5 text-gray-500"
            // Even if the content is not HTML anymore after the tags have been stripped, there are
            // still characters such as `&apos;` in the text
            dangerouslySetInnerHTML={{ __html: striptags(short_description) }}
          />
        </header>
        <div className="mt-1 flex items-center justify-end gap-x-2">
          {!!doi && (
            <Button className="w-fit gap-x-2 text-sm" variant="outline-rounded" size="sm" asChild>
              <a href={`https://doi.org/${doi?.replace('doi:', '')}`} target="_blank">
                <ExternalLink className="h-4 w-4" />
                DOI
              </a>
            </Button>
          )}
          <Button className="w-fit gap-x-2 text-sm" variant="outline-rounded" size="sm" asChild>
            <a href={url} target="_blank">
              <ExternalLink className="h-4 w-4" />
              Dataset
            </a>
          </Button>
        </div>
      </div>
    </li>
  );
}

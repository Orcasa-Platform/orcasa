'use client';

import { useRef } from 'react';

import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useMapSearchParams } from '@/store';

import type { Practice, PracticeListResponseDataItem } from '@/types/generated/strapi.schemas';

import { useIsOverTwoLines } from '@/hooks/ui/utils';

import Tag from '@/components/tag';
import { SlidingLinkButton } from '@/components/ui/sliding-link-button';
import { WithEllipsis } from '@/components/ui/with-ellipsis';

import { TypedPractice } from './types';

const Icons = ({ attributes }: { attributes: TypedPractice | undefined }) => {
  if (!attributes) return null;
  const { countries, language, source_name } = attributes;
  const countriesNames = countries?.data?.map((country) => country?.attributes?.name).join(', ');

  return (
    <div className="relative flex flex-wrap gap-x-1 gap-y-2">
      <Tag>
        {countriesNames && <WithEllipsis triggerClassName="text-start" text={countriesNames} />}
      </Tag>
      <Tag className="uppercase">{language?.join(', ')}</Tag>
      {source_name === 'WOCAT' && (
        <Image
          src="/assets/logos/wocat.png"
          width={91}
          height={20}
          alt="WOCAT"
          className="ml-auto max-h-[24px]"
        />
      )}
      {source_name === 'FAO' && (
        <Image
          src="/assets/logos/fao.svg"
          width={34}
          height={34}
          alt="FAO"
          className="absolute right-0 top-0 ml-auto max-h-[34px]"
        />
      )}
    </div>
  );
};

export default function Practice({ id, attributes }: PracticeListResponseDataItem) {
  const { title, short_description: shortDescription } = attributes || {};
  const searchParams = useMapSearchParams();
  const ref = useRef<HTMLParagraphElement>(null);
  const isOverTwoLines = useIsOverTwoLines(ref, true);

  return (
    <li key={id} className="mb-2 flex min-h-[252px] w-full gap-4 rounded-lg bg-white">
      <div className="flex w-full flex-col justify-between gap-4 p-6 text-gray-500">
        <header className="flex flex-col gap-4">
          <Icons attributes={attributes as TypedPractice} />
          <div className="font-serif text-lg leading-7 text-gray-700">{title}</div>
          <p
            ref={ref}
            className={cn('text-xs leading-5', {
              'line-clamp-2': isOverTwoLines,
            })}
          >
            {shortDescription}
          </p>
        </header>
        <div className="flex items-center justify-end">
          <SlidingLinkButton
            Icon={ArrowRight}
            position="right"
            href={`/practices/${id}?${searchParams.toString()}`}
            // Next.js has a bug where the sidebar is not scrolled up to the top when navigating but
            // up to where `{children}` is visually located *within* the layout. Paddings around
            // `{children}` also causes issues.
            // For this reason, the automatic scroll restoration is disabled and manually set inside
            // `(details)/layout.tsx`.
            scroll={false}
          >
            Learn more
          </SlidingLinkButton>
        </div>
      </div>
    </li>
  );
}

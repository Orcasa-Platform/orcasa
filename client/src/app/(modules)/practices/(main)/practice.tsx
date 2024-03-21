'use client';

import Image from 'next/image';

import { ArrowRight } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import type { Practice, PracticeListResponseDataItem } from '@/types/generated/strapi.schemas';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';
import { WithEllipsis } from '@/components/ui/with-ellipsis';

import { TypedPractice } from './types';

const Icons = ({ attributes }: { attributes: TypedPractice | undefined }) => {
  if (!attributes) return null;

  const { countries, language, source_name } = attributes;
  const countriesNames = countries?.data?.map((country) => country?.attributes?.name).join(', ');

  return (
    <div className="flex flex-wrap gap-x-1 gap-y-2">
      <div className="flex max-w-[200px] items-center rounded-2xl border border-green-700 px-2 text-2xs text-green-700">
        {countriesNames && <WithEllipsis triggerClassName="text-start" text={countriesNames} />}
      </div>
      <div className="flex items-center rounded-2xl border border-green-700 px-2 text-2xs uppercase text-green-700">
        {language?.join(', ')}
      </div>
      {source_name === 'WOCAT' && (
        <Image
          src="/assets/logos/wocat.png"
          width={110}
          height={24}
          alt="WOCAT"
          className="ml-auto max-h-[24px]"
        />
      )}
    </div>
  );
};

export default function Practice({ id, attributes }: PracticeListResponseDataItem) {
  const { title, short_description: shortDescription } = attributes || {};
  const searchParams = useMapSearchParams();

  return (
    <li key={id} className="mb-2 flex min-h-[252px] w-full gap-4 rounded-lg bg-gray-50">
      <div className="flex w-full flex-col justify-between gap-4 p-6 text-base text-slate-500">
        <header className="flex flex-col gap-4">
          <Icons attributes={attributes as TypedPractice} />
          <div className="font-serif text-lg leading-7 text-gray-700">{title}</div>
          <p className="text-xs leading-5">{shortDescription}</p>
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

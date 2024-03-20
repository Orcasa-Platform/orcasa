'use client';

import Image from 'next/image';

import { ChevronRight } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import type { Practice, PracticeListResponseDataItem } from '@/types/generated/strapi.schemas';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';
import { WithEllipsis } from '@/components/ui/with-ellipsis';
import GlobeIcon from '@/styles/icons/globe.svg';
import LanguageIcon from '@/styles/icons/language.svg';

import { TypedPractice } from './types';

const Icons = ({ attributes }: { attributes: TypedPractice | undefined }) => {
  if (!attributes) return null;

  const { countries, language, source_name } = attributes;
  const countriesNames = countries?.data?.map((country) => country?.attributes?.name).join(', ');

  return (
    <div className="relative flex flex-wrap gap-x-4 gap-y-2">
      <div className="flex max-w-[200px] items-start gap-2">
        <GlobeIcon className="mt-0.5 h-6 w-6 min-w-min" />
        <div className="text-base text-slate-500">
          {countriesNames && <WithEllipsis triggerClassName="text-start" text={countriesNames} />}
        </div>
      </div>

      <div className="flex gap-2">
        <LanguageIcon className="mt-0.5 h-6 w-6 min-w-min" />
        <div className="text-base uppercase text-slate-500">{language?.join(', ')}</div>
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
      {source_name === 'FAO' && (
        <Image
          src="/assets/logos/fao.svg"
          width={110}
          height={24}
          alt="FAO"
          className="absolute right-0 top-0 ml-auto max-h-[44px]"
        />
      )}
    </div>
  );
};

export default function Practice({ id, attributes }: PracticeListResponseDataItem) {
  const { title, short_description: shortDescription } = attributes || {};
  const searchParams = useMapSearchParams();

  return (
    <li key={id} className="mb-2 flex min-h-[240px] w-full gap-4 bg-gray-50">
      <div className="flex w-full flex-col justify-between gap-6 px-12 py-10 text-base text-slate-500">
        <header className="flex flex-col gap-6">
          <Icons attributes={attributes as TypedPractice} />
          <div className="font-serif text-2xl leading-10 text-gray-700">{title}</div>
          <p className="leading-7">{shortDescription}</p>
        </header>
        <div className="flex items-center justify-end">
          <SlidingLinkButton
            Icon={ChevronRight}
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

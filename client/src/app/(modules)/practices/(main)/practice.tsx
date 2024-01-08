'use client';

import Image from 'next/image';

import { ChevronRight } from 'lucide-react';

import { useMapSearchParams } from '@/store';

import { Practice, PracticeListResponseDataItem } from '@/types/generated/strapi.schemas';

import { SlidingLinkButton } from '@/components/ui/sliding-link-button';

import GlobeIcon from '@/styles/icons/globe.svg';
import LanguageIcon from '@/styles/icons/language.svg';

const Icons = ({ attributes }: { attributes: Practice | undefined }) => {
  if (!attributes) return null;

  const { country, language, source_name } = attributes;
  const countryName = country?.data?.attributes?.name;

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      <div className="flex gap-2">
        <GlobeIcon className="h-6 w-6 min-w-min" />
        <div className="text-base text-slate-500">{countryName}</div>
      </div>

      <div className="flex gap-2">
        <LanguageIcon className="h-6 w-6 min-w-min" />
        <div className="text-base uppercase text-slate-500">{language}</div>
      </div>

      {source_name === 'WOCAT' && (
        <Image
          src="/assets/logos/wocat.png"
          width={110}
          height={24}
          alt="WOCAT"
          className="ml-auto"
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
          <Icons attributes={attributes} />
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

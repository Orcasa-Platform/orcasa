import { startCase } from 'lodash';
import type { Metadata } from 'next';

import Hydrate from '@/lib/react-query/hydrate';

import type { Section as SectionType } from '@/types/app';

import Providers from '@/app/page-providers';

import Section from '@/containers/section';

import { metadata as baseMetadata } from '../page';
import { prefetchQueries } from '../prefetch';
export default async function MapPage({
  params: { section },
}: {
  params: { section: SectionType };
}) {
  const dehydratedState = await prefetchQueries();
  return (
    <Hydrate state={dehydratedState}>
      <Providers>
        <Section section={section} />
      </Providers>
    </Hydrate>
  );
}

export async function generateMetadata({
  params: { section },
}: {
  params: { section: SectionType };
}): Promise<Metadata> {
  return {
    ...baseMetadata,
    title: `ORCaSa - ${startCase(section)}`,
  };
}

export async function generateStaticParams() {
  return ['map-data', 'scientific-evidence', 'practices', 'network', 'datasets'];
}

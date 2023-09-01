import Hydrate from '@/lib/react-query/hydrate';

import type { Section as SectionType } from '@/types/app';

import Providers from '@/app/page-providers';

import Section from '@/containers/section';

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

export async function generateStaticParams() {
  return ['map-data', 'scientific-evidence', 'practices', 'network', 'datasets'];
}

import Hydrate from '@/lib/react-query/hydrate';

import Providers from '@/app/page-providers';

import Home from '@/containers/home';

import { prefetchQueries } from './prefetch';

export default async function HomePage() {
  const dehydratedState = await prefetchQueries();

  return (
    <Hydrate state={dehydratedState}>
      <Providers>
        <Home />
      </Providers>
    </Hydrate>
  );
}

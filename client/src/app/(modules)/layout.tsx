import Hydrate from '@/lib/react-query/hydrate';

import Providers from '@/app/page-providers';

import Nav from '@/containers/nav';
import SyncStoreHome from '@/containers/sync-store';

import MobileMenu from '@/components/mobile-menu';
import MobileMenuBar from '@/components/mobile-menu-bar';

import { prefetchQueries } from '../prefetch';

export default async function ModulesLayout({ children }: { children: React.ReactNode }) {
  const dehydratedState = await prefetchQueries();

  return (
    <Hydrate state={dehydratedState}>
      <Providers>
        <main className="flex min-h-screen flex-col">
          <div className="h-screen w-screen">
            <MobileMenuBar />
            <MobileMenu />
            <Nav />
            {children}
          </div>
        </main>
        <SyncStoreHome />
      </Providers>
    </Hydrate>
  );
}

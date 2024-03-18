import Hydrate from '@/lib/react-query/hydrate';

import Providers from '@/app/page-providers';

import Nav from '@/containers/nav';
import SyncStoreHome from '@/containers/sync-store';

import MobileMenu from '@/components/mobile-menu';
import MobileMenuBar from '@/components/mobile-menu-bar';
import { Dialog } from '@/components/ui/dialog';

import { prefetchQueries } from '../prefetch';

export default async function ModulesLayout({ children }: { children: React.ReactNode }) {
  const dehydratedState = await prefetchQueries();

  return (
    <Hydrate state={dehydratedState}>
      <Providers>
        <main className="flex min-h-screen flex-col bg-gray-800">
          <div className="h-screen w-screen">
            <Dialog>
              <MobileMenuBar />
              <MobileMenu />
            </Dialog>
            <Nav />
            {children}
          </div>
        </main>
        <SyncStoreHome />
      </Providers>
    </Hydrate>
  );
}

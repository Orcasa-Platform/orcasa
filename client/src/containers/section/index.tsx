import { Section } from '@/types/app';

import Map from './map';
import Nav from './nav';
import Page from './page';
import Sidebar from './sidebar';
import SyncStoreHome from './sync-store';

export default async function Section({ section }: { section: Section }) {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="h-screen w-screen">
          <Nav />
          <Map />
          <Sidebar section={section}>
            <Page section={section} />
          </Sidebar>
        </div>
      </main>

      <SyncStoreHome />
    </>
  );
}

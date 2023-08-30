import Datasets from '../home/datasets';
import Map from '../home/map';
import Nav from '../home/nav';
import Sidebar from '../home/sidebar';
import SyncStoreHome from '../home/sync-store';

export default async function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col">
        <div className="h-screen w-screen">
          <Nav />
          <Map />
          <Sidebar>
            <Datasets />
          </Sidebar>
        </div>
      </main>

      <SyncStoreHome />
    </>
  );
}

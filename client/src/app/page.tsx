import Datasets from '@/containers/home/datasets';
import Map from '@/containers/home/map';

export default async function Home() {
  return (
    // <Hydrate state={dehydratedState}>
    <main className="flex min-h-screen flex-col">
      <div className="h-screen w-screen">
        <Map />
        <Datasets />
      </div>
    </main>
    // </Hydrate>
  );
}

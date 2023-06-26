import Datasets from '@/containers/home/datasets';
import Map from '@/containers/home/map';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="h-screen w-screen">
        <Map />
        <Datasets />
      </div>
    </main>
  );
}

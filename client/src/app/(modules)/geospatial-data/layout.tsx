import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

export const metadata = {
  title: 'Geospatial Data',
};

export default function GeospatialDataModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      <Sidebar section="geospatial-data">
        <h1 className="max-w-[372px] border-l-4 border-yellow-500 pl-5 font-serif text-lg leading-7">
          Give context to your research by scientifically-reliable{' '}
          <span className="font-semibold text-yellow-600">map layers related to soil carbon</span>.
        </h1>

        {children}
      </Sidebar>
    </>
  );
}

import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

export const metadata = {
  title: 'Geospatial Data',
};

export default function GeospatialDataModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      <Sidebar section="geospatial-data">{children}</Sidebar>
    </>
  );
}

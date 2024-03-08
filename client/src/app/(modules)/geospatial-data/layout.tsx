import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

export const metadata = {
  title: 'Geospatial Data',
  description:
    'Identify areas of interest for your research or interventions using global and local data on soil carbon from trusted sources: Soils Revealed, FAO, Soils Grids, Global Forest Watch, and others.',
};

export default function GeospatialDataModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      <Sidebar section="geospatial-data">{children}</Sidebar>
    </>
  );
}

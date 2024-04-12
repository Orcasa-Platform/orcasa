import MobileGeospatialFooter from '@/app/(modules)/geospatial-data/mobile-geospatial-footer';

import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

export const metadata = {
  title: 'Geospatial data',
  description:
    'Identify areas of interest for your research or interventions using global and local data on soil carbon from trusted sources: Soils Revealed, FAO, Soils Grids, Global Forest Watch, and others.',
};

export default function GeospatialDataModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-800">
      <Map />
      <MobileGeospatialFooter />
      <Sidebar section="geospatial-data">{children}</Sidebar>
    </div>
  );
}

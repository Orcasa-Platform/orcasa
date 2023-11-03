import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

export const metadata = {
  title: 'Impact4Soil - Network',
};

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      <Sidebar section="network">{children}</Sidebar>
    </>
  );
}

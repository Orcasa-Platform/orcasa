import Map from '@/containers/map';
import Sidebar from '@/containers/sidebar';

export const metadata = {
  title: 'ORCaSa - Network',
};

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map section="network" />
      <Sidebar section="network">{children}</Sidebar>
    </>
  );
}

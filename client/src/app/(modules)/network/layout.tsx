import Map from '@/containers/map';

export const metadata = {
  title: 'Impact4Soil - Network',
};

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      {children}
    </>
  );
}

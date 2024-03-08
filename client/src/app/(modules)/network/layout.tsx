import Map from '@/containers/map';

export const metadata = {
  title: 'Network',
  description:
    'Find synergies and promote cooperation between heterogeneous actors and initiatives within the soil carbon field.',
};

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      {children}
    </>
  );
}

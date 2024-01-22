import Map from '@/containers/map';

export const metadata = {
  title: 'Network',
};

export default function NetworkModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      {children}
    </>
  );
}

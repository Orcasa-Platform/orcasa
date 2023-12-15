import Map from '@/containers/map';

export const metadata = {
  title: 'Impact4Soil - Practices',
};

export default function PracticesModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      {children}
    </>
  );
}

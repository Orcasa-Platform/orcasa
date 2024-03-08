import Map from '@/containers/map';

export const metadata = {
  title: 'Practices',
  description:
    'Have a real view of concrete land-management practices that generate a positive impact on soil carbon.',
};

export default function PracticesModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Map />
      {children}
    </>
  );
}

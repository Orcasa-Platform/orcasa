import Breadcrumb from '@/components/home/breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb />
      {children}
    </>
  );
}

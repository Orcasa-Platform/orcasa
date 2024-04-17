import Breadcrumb from '@/components/home/breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb />
      <div className="p-4 lg:px-[242px]">{children}</div>
    </>
  );
}

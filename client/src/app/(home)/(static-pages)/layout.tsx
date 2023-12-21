import Breadcrumb from '@/components/home/breadcrumb';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Breadcrumb />
      <div className="px-[242px]">{children}</div>
    </>
  );
}

export const metadata = {
  title: 'Impact4Soil - Datasets',
};

export default function DatasetsModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-y-auto py-10 pl-[117px]">
      <div className="container px-6 xl:px-12 2xl:px-24">{children}</div>
    </div>
  );
}

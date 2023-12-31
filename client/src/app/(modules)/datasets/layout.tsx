export const metadata = {
  title: 'Impact4Soil - Datasets',
};

export default function DatasetsModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-y-auto py-10 pl-[117px]">
      <div className="container px-6 lg:max-w-[968px] xl:max-w-[968px] xl:px-0 2xl:max-w-[968px] 2xl:px-0">
        {children}
      </div>
    </div>
  );
}

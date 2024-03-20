export const metadata = {
  title: 'Datasets',
  description:
    'Explore datasets on Soil Organic carbon from diverse trusted sources to find the correct information for your activities.',
};

export default function DatasetsModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-y-auto py-10 pl-[90px]">
      <div className="container px-6 lg:max-w-[968px] xl:max-w-[968px] xl:px-0 2xl:max-w-[968px] 2xl:px-0">
        {children}
      </div>
    </div>
  );
}

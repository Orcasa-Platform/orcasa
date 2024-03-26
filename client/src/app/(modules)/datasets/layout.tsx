export const metadata = {
  title: 'Datasets',
  description:
    'Explore datasets on Soil Organic carbon from diverse trusted sources to find the correct information for your activities.',
};

import Image from 'next/image';

import { sourceToLogo } from './dataset';

export default function DatasetsModuleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="ml-[90px] mr-2 mt-2 h-[calc(100vh-68px-8px)] w-[calc(100vw-90px-8px)] overflow-y-auto rounded-lg bg-gray-700"
      style={{ backgroundImage: "url('/images/datasets-background.svg')" }}
    >
      {children}
      <footer className="fixed bottom-0 flex h-[68px] w-[calc(100vw-90px)] items-center justify-between gap-10 bg-gray-800 py-4 pl-10 pr-12">
        <p className="text-sm leading-7 text-white">Trusted sources:</p>
        <ul className="flex items-center gap-10">
          {Object.entries(sourceToLogo).map(([source, { src, alt, width, height }]) => (
            <li key={source}>
              <Image src={src} alt={alt} width={width} height={height} />
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import Carousel from './carousel';

const SolutionsSection = () => (
  <div className="relative h-[700px]">
    <div className={`absolute flex h-full w-full items-center justify-center p-10 pt-0`}>
      <img src="/images/shape2.svg" className="h-[700px] w-full" alt="" />
    </div>
    <div className={`absolute flex h-full w-full flex-wrap items-center justify-center`}>
      <div className="w-[70%]">
        <div className="flex w-[374px] flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div className="text-sm uppercase leading-[14px] tracking-wider text-gray-400">
              solutions for soil carbon experts
            </div>
            <div className="flex flex-col gap-8">
              <h2 className="text-[32px] font-semibold text-slate-700">
                Hear from Impact4Soil users
              </h2>
              <div className="h-2 w-20 bg-green-700" />
            </div>
          </div>
          <div className="w-[374px]">
            <span className="text-slate-700">
              Impact4Soil is a meeting point for the research and funding soils carbon communities
              to go further and faster as a collective. It is designed for different types of users:{' '}
            </span>
            <span className="font-semibold text-slate-700">
              researchers, policymakers, funding agencies, companies and NGOs.
            </span>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2">
        <Carousel />
      </div>
    </div>
  </div>
);

export default SolutionsSection;

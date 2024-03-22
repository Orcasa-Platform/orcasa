/* eslint-disable @next/next/no-img-element */
import Carousel from './carousel';

const SolutionsSection = () => (
  <div className="relative h-[800px] lg:h-[700px]">
    <div className="absolute hidden h-full w-full items-center justify-center p-10 lg:flex lg:pt-0">
      <img src="/images/shape2.svg" className="h-[700px] w-full" alt="" />
    </div>
    <div className="absolute flex h-full w-full flex-wrap items-center justify-center">
      <div className="lg:w-[80%] xl:w-[1000px]">
        <div className="flex w-[374px] flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div className="text-center font-serif text-base uppercase leading-[14px] tracking-wider text-gray-400 lg:text-left lg:text-sm">
              Solutions for soil carbon experts
            </div>
            <div className="flex flex-col items-center gap-8">
              <h2 className="font-serif text-2xl font-semibold text-slate-700 lg:text-3.5xl">
                Hear from Impact4Soil users
              </h2>
              <div className="h-2 w-20 bg-green-700" />
            </div>
          </div>
          <div className="px-4 lg:w-[374px] lg:px-0">
            <span className="text-slate-700">
              Impact4Soil is a meeting point for soil carbon research and funding communities to go
              further and faster as a collective. It is designed for different types of users:{' '}
            </span>
            <span className="font-semibold text-slate-700">
              researchers, policymakers, funding agencies, companies and NGOs.
            </span>
          </div>
        </div>
      </div>
      <div className="left-1/2 mt-4 lg:absolute lg:mt-0">
        <Carousel />
      </div>
    </div>
  </div>
);

export default SolutionsSection;

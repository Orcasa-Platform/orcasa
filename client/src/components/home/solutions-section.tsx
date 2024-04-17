/* eslint-disable @next/next/no-img-element */
import Carousel from './carousel';

const SolutionsSection = () => (
  <div className="relative z-10 h-[800px] lg:-bottom-24 lg:h-[700px]">
    <div className="absolute hidden h-full w-full items-center justify-center p-10 lg:flex lg:pt-0">
      <img src="/images/shape2.svg" className="h-[700px] w-full" alt="" />
    </div>
    <div className="absolute flex h-full w-full flex-wrap items-center justify-center">
      <div className="lg:w-[80%] xl:w-[1000px]">
        <div className="flex w-[374px] flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div className="text-center font-serif text-sm uppercase leading-[14px] tracking-wider text-gray-500 lg:text-left">
              Solutions for soil carbon experts
            </div>
            <div className="flex flex-col items-center gap-8">
              <h2 className="text-center font-serif text-3xl font-semibold text-slate-700 lg:text-left lg:text-3xl">
                Hear from Impact4Soil users
              </h2>
              <div className="h-2 w-20 rounded-lg bg-yellow-500 lg:self-start" />
            </div>
          </div>
          <div className="text-balance px-4 text-center leading-7 text-gray-500 lg:w-[374px] lg:px-0 lg:text-left lg:leading-normal">
            <span>
              Impact4Soil is a meeting point for soil carbon research and funding communities to go
              further and faster as a collective. It is designed for different types of users:{' '}
            </span>
            <span className="lg:font-semibold">
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

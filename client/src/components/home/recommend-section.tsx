/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import LinkIcon from 'public/images/link.svg';

import { cn } from '@/lib/classnames';

import { Button } from '../ui/button';

const RecommendSection = () => {
  const renderImage = (isMobile: boolean) => (
    <div
      className={cn('relative ml-6 mr-8 mt-10 lg:mx-0', {
        'hidden lg:flex': !isMobile,
        'lg:hidden': isMobile,
      })}
    >
      <div className="ml-auto lg:ml-0 lg:max-w-none">
        <Image
          src="/images/homepage-recommendation.png"
          className="overflow-hidden rounded-lg shadow-lg"
          alt=""
          width={480}
          height={275}
        />
      </div>
    </div>
  );

  return (
    <div className="relative mx-4 h-[680px] w-[calc(100%-16px)] lg:mx-0 lg:w-full">
      <div className="absolute hidden h-full w-full items-center justify-center p-10 pt-0 lg:flex">
        <img src="/images/shape3.svg" className="h-[564px] w-full" alt="" />
      </div>
      <div className="h-full w-full items-center justify-center gap-[100px] lg:absolute lg:flex  lg:flex-wrap">
        <div className="flex w-full gap-24 lg:w-[80%] xl:w-[1000px]">
          <div className="flex w-full flex-col gap-6 md:max-lg:flex-col md:max-lg:items-center lg:max-w-[40%]">
            <div className="self-start rounded-2xl bg-green-700 px-3 py-2 text-center font-serif text-sm uppercase leading-3 tracking-wider text-white">
              we recommend
            </div>
            <h2 className="font-serif text-3xl font-semibold text-gray-700">
              Carbon schemes inventory platform
            </h2>
            {renderImage(true)}
            <div className="w-[90%] text-base leading-7 text-gray-500 lg:w-[374px] lg:leading-normal lg:text-gray-600">
              Carbon Schemes Inventories, or CSI, is a new web platform dedicated to providing
              detailed information about carbon farming schemes in Europe and around the world. This
              platform has been developed in the framework of the EJP Soil Road4Schemes project.
            </div>
            <Button
              variant="outline"
              className="flex h-14 w-[calc(100%-16px)] self-start lg:w-auto"
              size="lg"
              asChild
            >
              <Link
                href={'http://reports.crea.gov.it/powerbi/CarbonSchemesInventory.html'}
                target="_blank"
              >
                Visit the platform
                <LinkIcon className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </div>
          {renderImage(false)}
        </div>
      </div>
    </div>
  );
};

export default RecommendSection;

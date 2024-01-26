/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import { ExternalLink } from 'lucide-react';

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
          src="/images/ejp-logo.png"
          alt="Road4Schemes logo"
          className="absolute -left-6 -top-8 flex flex-col items-start justify-start gap-2 bg-white px-3 shadow-2xl"
          width={169}
          height={66}
        />
        <Image
          src="/images/ejpsoil.png"
          className="shadow-2xl"
          alt="Road4Schemes demo"
          width={480}
          height={275}
        />
      </div>
    </div>
  );

  return (
    <div className="relative mx-4 h-[680px] w-full lg:mx-0 lg:h-[700px]">
      <div className="absolute hidden h-full w-full items-center justify-center p-10 pt-0 lg:flex">
        <img src="/images/shape3.svg" className="h-[564px] w-full" alt="" />
      </div>
      <div className="h-full w-full items-center justify-center gap-[100px] lg:absolute lg:flex  lg:flex-wrap">
        <div className="flex w-full gap-24 lg:w-[80%] xl:w-[1000px]">
          <div className="flex w-full flex-col gap-6 md:max-lg:flex-col md:max-lg:items-center lg:max-w-[40%]">
            <div className="h-8 w-[143px] rounded-lg bg-green-700 px-2 py-1.5 text-center text-sm font-semibold uppercase leading-normal tracking-wider text-white">
              we recommend
            </div>
            <h2 className="font-serif text-2xl leading-[48px] text-gray-700 lg:text-3.5xl">
              Carbon schemes inventory platform
            </h2>
            {renderImage(true)}
            <div className="w-[90%] text-base text-gray-700 lg:w-[374px]">
              Carbon Schemes Inventories, or C.S.I., is a new web platform dedicated to providing
              detailed information about carbon farming schemes in Europe and around the world.
            </div>
            <Button variant="outline" className="flex w-[90%] px-0 pt-2 lg:w-[173px]" asChild>
              <Link
                href={'http://reports.crea.gov.it/powerbi/CarbonSchemesInventory.html'}
                target="_blank"
              >
                Visit EJP soil
                <ExternalLink className="ml-6" />
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

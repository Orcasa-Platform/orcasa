/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';

import { ExternalLink } from 'lucide-react';

import { Button } from '../ui/button';

const RecommendSection = () => (
  <div className="relative h-[700px]">
    <div className={`absolute flex h-full w-full items-center justify-center p-10 pt-0`}>
      <img src="/images/shape3.svg" className="h-[564px] w-full" alt="" />
    </div>
    <div
      className={`absolute flex h-full w-full flex-wrap items-center justify-center gap-[100px]`}
    >
      <div className="flex gap-24">
        <div className="flex flex-col gap-6">
          <div className="h-8 w-[143px] rounded-lg bg-green-700 px-2 py-1.5 text-center text-sm font-semibold uppercase leading-normal tracking-wider text-white">
            we recommend
          </div>
          <div className="w-[504px] font-serif text-[32px] leading-[48px] text-gray-700">
            Carbon schemes inventory platform
          </div>
          <div className="w-[374px] text-base text-gray-700">
            Carbon Schemes Inventories, or C.S.I., is a new web platform dedicated to providing
            detailed information about carbon farming schemes in Europe and around the world.
          </div>
          <Button variant="default" className="flex w-[173px] px-0 pt-2" asChild>
            <Link
              href={'http://reports.crea.gov.it/powerbi/CarbonSchemesInventory.html'}
              target="_blank"
            >
              Visit EJP soil
              <ExternalLink className="ml-6" />
            </Link>
          </Button>
        </div>
        <div className="relative mt-10">
          <div className="absolute -left-10 -top-10 flex flex-col items-start justify-start gap-2 bg-white px-4 shadow-2xl">
            <img
              className="h-[84px] w-[169px]"
              src="/images/ejp-logo.png"
              alt="Road4Schemes logo"
            />
          </div>
          <img src="/images/ejpsoil.png" className="w-[480px] shadow-2xl" alt="Road4Schemes demo" />
        </div>
      </div>
    </div>
  </div>
);

export default RecommendSection;

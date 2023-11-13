/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import HomeNavBar from '@/components/home/nav-bar';
import { Button } from '@/components/ui/button';

export default async function HomePage() {
  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <HomeNavBar />
      <div className="relative h-full w-screen overflow-auto bg-white">
        <div className="absolute flex h-full w-full items-center justify-center p-10 pt-[120px]">
          <img src="/images/shape.svg" className="w-full" alt="" />
        </div>
        <div className="absolute flex h-full w-full items-center justify-center pt-[88px]">
          <div className="flex max-h-full flex-wrap items-center justify-center gap-[100px]">
            <div>
              <div className="mb-6 w-[476px] font-serif text-[40px] text-slate-700">
                Making an impact on the planet&apos;s soils.
              </div>
              <div className="w-[476px]">
                <span className="font-['Roboto'] text-base font-normal leading-normal text-slate-700">
                  Currently, one-third of the global soils are degraded and depleted in carbon. This
                  is why
                </span>
                <span className="text-slate-700">
                  {' '}
                  the Impact4Soil platform is here, to drive cooperation and knowledge sharing on
                  soil carbon at an international level.
                </span>
              </div>
              <Button variant="primary" asChild className="mt-10">
                <Link href={'/geospatial-data'}>
                  Explore the ground
                  <ArrowRight className="ml-4" />
                </Link>
              </Button>
            </div>
            <Image
              alt="Map demo"
              className="h-[300px] w-[463px] shadow"
              src="/images/home1.jpg"
              width={463}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

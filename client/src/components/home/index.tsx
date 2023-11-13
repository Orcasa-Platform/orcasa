/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { getHomeStats } from '@/types/generated/home-stat';

import HomeNavBar from '@/components/home/nav-bar';
import Stats from '@/components/home/stats';
import { Button } from '@/components/ui/button';

import ArrowDownLong from '@/styles/icons/arrow-down-long.svg';
const NAV_HEIGHT = 72;

export default async function HomePage() {
  const data = await getHomeStats({ populate: '*' });
  const stats = data?.data?.map((item) => ({
    title: item?.attributes?.title,
    value: item?.attributes?.value,
    class: item?.attributes?.class,
  }));

  const firstSection = (
    <div className={`relative h-[616px]`}>
      <div className={`absolute flex h-full w-full items-center justify-center p-10`}>
        <img src="/images/shape.svg" className="h-[616px] w-full" alt="" />
      </div>
      <div
        className={`absolute flex h-full w-full flex-wrap items-center justify-center gap-[100px]`}
      >
        <div>
          <div className="mb-6 w-[476px] font-serif text-[40px] text-slate-700">
            Making an impact on the planet&apos;s soils.
          </div>
          <div className="w-[476px]">
            <span className="font-['Roboto'] text-base font-normal leading-normal text-slate-700">
              Currently, one-third of the global soils are degraded and depleted in carbon. This is
              why
            </span>
            <span className="text-slate-700">
              {' '}
              the Impact4Soil platform is here, to drive cooperation and knowledge sharing on soil
              carbon at an international level.
            </span>
          </div>
          <Button variant="primary" asChild className="mt-10">
            <Link href={'/geospatial-data'}>
              Explore the ground
              <ArrowRight className="ml-6" />
            </Link>
          </Button>
        </div>
        <div className="relative">
          <Image
            alt="Map demo"
            className="h-[300px] w-[463px] drop-shadow-2xl"
            src="/images/hero.jpg"
            width={463}
            height={300}
            priority
          />
          {stats && <Stats className="-mt-10 ml-16" stats={stats} />}
        </div>
        <div className="absolute bottom-4 flex items-center">
          <button
            type="button"
            className="flex h-14 w-[34px] items-center justify-center rounded-[40px] bg-white shadow"
          >
            <ArrowDownLong className="text-slate-700" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <HomeNavBar />
      <div
        className={`flex flex-col overflow-x-scroll bg-white mt-[${NAV_HEIGHT}px] h-[calc(100vh-${NAV_HEIGHT}px)] min-h-[calc(100vh-${NAV_HEIGHT}px)]`}
      >
        {firstSection}
      </div>
    </div>
  );
}

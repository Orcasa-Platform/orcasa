/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/classnames';

import Stats from '@/components/home/stats';
import { Button } from '@/components/ui/button';
import SmoothScrollLink from '@/components/ui/smooth-scroll-link';
import ArrowDownLong from '@/styles/icons/arrow-down-long.svg';

const HeroSection = () => {
  const renderHeroImage = (isMobile: boolean) => {
    return (
      <div
        className={cn('relative', {
          'mb-8 max-w-[463px] pb-20 lg:pb-10': isMobile,
        })}
      >
        <Image
          alt="Map demo"
          className={cn('w-[463px] drop-shadow-2xl', {
            'lg:hidden': isMobile,
            'hidden lg:block': !isMobile,
          })}
          src="/images/hero.jpg"
          width={463}
          height={300}
          priority
        />
        <Stats
          className={cn({
            'absolute bottom-0 right-0 flex max-w-[220px] flex-wrap md:max-w-full md:flex-nowrap lg:hidden':
              isMobile,
            '-mt-10 ml-16 hidden lg:flex': !isMobile,
          })}
        />
      </div>
    );
  };

  return (
    <div
      id="hero"
      className="relative min-h-[calc(100vh-72px)] scroll-mt-12 lg:h-[calc(100vh-72px)]"
    >
      <div className="absolute hidden h-full w-full justify-center p-10 pt-0 lg:flex xl:items-center">
        <img src="/images/shape.svg" className="h-[616px] w-full" alt="" />
      </div>
      <div className="max-w-screen h-full w-full flex-wrap justify-center gap-[100px] px-4 lg:absolute lg:flex lg:pt-16 xl:items-center xl:px-0 xl:pt-0">
        <div>
          <h2 className="mb-6 font-serif text-[40px] text-slate-700 lg:w-[476px]">
            Making an impact on the planet&apos;s soils.
          </h2>
          {renderHeroImage(true)}
          <div className="lg:w-[476px]">
            <span className="text-base leading-normal text-slate-700">
              Currently, one-third of the global soils are degraded and depleted in carbon. This is
              why
            </span>
            <span className="text-slate-700">
              {' '}
              the Impact4Soil platform is here, to drive cooperation and knowledge sharing on soil
              carbon at an international level.
            </span>
          </div>
          <Button variant="primary" asChild className="mt-10 w-[calc(100%-50px)] lg:w-auto">
            <Link href={'/geospatial-data'}>
              Explore the ground
              <ArrowRight className="ml-6" />
            </Link>
          </Button>
        </div>
        {renderHeroImage(false)}
        <div className="absolute bottom-4 hidden items-center shadow-2xl lg:flex">
          <SmoothScrollLink
            href="#modules"
            className="group flex h-14 w-[34px] items-center justify-center gap-2 rounded-[40px] bg-white shadow"
          >
            <ArrowDownLong className="group-hover:opacity-80" />
          </SmoothScrollLink>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/classnames';

import BackgroundShape from '/public/images/shape.svg';

import Stats from '@/components/home/stats';
import { Button } from '@/components/ui/button';
import SmoothScrollLink from '@/components/ui/smooth-scroll-link';
import ArrowDownLong from '@/styles/icons/arrow-down-long.svg';

const HeroSection = () => {
  const renderHeroImage = (isMobile: boolean) => {
    return (
      <div
        className={cn('relative lg:max-xl:max-w-[363px]', {
          'mb-8 max-w-[463px] pb-20 lg:mb-0 lg:pb-0': isMobile,
        })}
      >
        <div className="relative">
          <Image
            alt="Platform"
            className={cn('drop-shadow-2xl', {
              'lg:hidden': isMobile,
              'hidden lg:block': !isMobile,
            })}
            src="/images/hero.png"
            width={472}
            height={266}
            priority
          />
          <Stats
            className={cn({
              absolute: true,
              '-bottom-16 -right-2 flex max-w-[220px] flex-wrap md:max-w-full md:flex-nowrap lg:hidden':
                isMobile,
              '-bottom-11 left-16 hidden lg:flex lg:max-xl:-bottom-28 lg:max-xl:-left-8': !isMobile,
            })}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      id="hero"
      className="relative scroll-mt-12 bg-gray-700 pb-10 pt-6 lg:h-[calc(100vh-60px)] lg:min-h-[calc(100vh-60px)] lg:bg-gray-800 lg:py-0"
    >
      <div className="absolute hidden h-full w-full justify-center p-10 pt-0 lg:flex xl:items-center">
        <BackgroundShape className="h-[616px] w-full text-gray-700" />
      </div>
      <div className="h-full w-full justify-center px-4 text-white lg:absolute lg:flex lg:pt-24 xl:items-center xl:px-0 xl:pt-16">
        <div className="gap-x-[100px] gap-y-20 lg:flex lg:max-w-[948px] lg:flex-wrap xl:max-w-[1048px]">
          <div className="md:max-lg:flex md:max-lg:flex-col md:max-lg:items-center">
            <h2 className="mb-6 font-serif text-3xl md:max-lg:text-center lg:w-[476px] lg:text-5xl lg:leading-[72px]">
              Making an impact on the planet&apos;s soils.
            </h2>
            {renderHeroImage(true)}
            <div className="lg:w-[476px]">
              <span className="text-sm leading-7 text-gray-200 lg:text-base lg:leading-normal lg:text-gray-150">
                Currently, one-third of global soils are degraded and depleted in carbon. The
                Impact4Soil platform is here to drive cooperation and knowledge sharing on soil
                carbon at an international level.
              </span>
            </div>
            <Button variant="primary" asChild className="mt-6 h-14 w-[calc(100%-32px)] lg:w-auto">
              <Link href={'/geospatial-data'}>
                Explore the ground
                <ArrowRight className="ml-6" />
              </Link>
            </Button>
          </div>
          {renderHeroImage(false)}
          <div className="hidden basis-full items-center lg:flex lg:justify-center">
            <SmoothScrollLink
              href="#modules"
              className="flex h-14 w-[34px] items-center justify-center rounded-[40px] border border-white bg-gray-800 text-white transition-colors hover:bg-gray-900"
            >
              <span className="sr-only">Scroll to the content</span>
              <ArrowDownLong />
            </SmoothScrollLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

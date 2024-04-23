/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import Link from 'next/link';

import LinkIcon from 'public/images/link.svg';

import { cn } from '@/lib/classnames';

import { getHomepageRecommendation } from '@/types/generated/homepage-recommendation';
import type { HomepageRecommendationResponseDataObject } from '@/types/generated/strapi.schemas';

import { Button } from '../ui/button';

export default async function RecommendSection() {
  let recommendation: HomepageRecommendationResponseDataObject | undefined;

  try {
    const { data } = await getHomepageRecommendation();
    recommendation = data;
  } catch (e) {}

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
          className="absolute -left-6 -top-8 flex flex-col items-start justify-start gap-2 overflow-hidden rounded-lg bg-white px-3 shadow-lg"
          width={169}
          height={66}
        />
        <Image
          src="/images/ejpsoil.png"
          className="overflow-hidden rounded-lg shadow-lg"
          alt="Road4Schemes demo"
          width={480}
          height={275}
        />
      </div>
    </div>
  );

  if (!recommendation?.attributes) {
    return null;
  }

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
              {recommendation.attributes.title}
            </h2>
            {renderImage(true)}
            <div className="w-[90%] text-base leading-7 text-gray-500 lg:w-[374px] lg:leading-normal lg:text-gray-600">
              {recommendation.attributes.description}
            </div>
            <Button
              variant="outline"
              className="flex h-14 w-[calc(100%-16px)] self-start lg:w-auto"
              size="lg"
              asChild
            >
              <Link href={recommendation.attributes.link_url} target="_blank">
                {recommendation.attributes.link_text}
                <LinkIcon className="ml-2 h-6 w-6" />
              </Link>
            </Button>
          </div>
          {renderImage(false)}
        </div>
      </div>
    </div>
  );
}

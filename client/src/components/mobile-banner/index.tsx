'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

const images = {
  'geospatial-data': '/images/mobile-geospatial-data.png',
  practices: '/images/mobile-practices.png',
  network: '/images/mobile-network.png',
  datasets: '/images/mobile-datasets.png',
};

const Banner = ({
  section,
}: {
  section: 'geospatial-data' | 'network' | 'practices' | 'datasets';
}) => {
  const [bannerOpen, setBannerOpen] = useState(true);
  const closeBanner = () => {
    setBannerOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ORCASA_DESKTOP_BANNER_CLOSED', 'true');
    }
  };

  const isBannerClosed =
    typeof window !== 'undefined' && localStorage.getItem('ORCASA_DESKTOP_BANNER_CLOSED');

  if (isBannerClosed || !bannerOpen) return null;

  return (
    <div className="relative z-10 h-[230px] bg-gray-800 text-white">
      <div className="flex justify-center gap-6 self-stretch px-4 pb-6 pt-4">
        <div className="font-serif text-base leading-relaxed">
          <span>Navigate in a </span>
          <span className="font-semibold leading-normal">desktop screen</span>
          <span> for a complete experience.</span>
        </div>
        <Button variant="outline-dark" onClick={closeBanner}>
          Close
        </Button>
      </div>
      <div className="flex items-end gap-8">
        <Image
          alt=""
          height={75}
          width={75}
          src="/images/mobile-banner-icons.png"
          className="h-[75px]"
        />
      </div>
      <Image
        alt="Desktop screen mockup of the website"
        height={246}
        width={437}
        className="absolute -bottom-[68px] -right-8 h-[246px] w-[437px] object-contain pl-[107px]"
        src={images[section]}
      />
      {section === 'network' && (
        <div className="absolute bottom-[110px] flex w-full justify-end text-sm font-semibold">
          <p className="rounded-l-lg bg-green-700 px-1.5 py-1">Add organisations and initiatives</p>
        </div>
      )}
    </div>
  );
};

export default Banner;

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';

const images = {
  'geospatial-data': '/images/geospatial-data.png',
  practices: '/images/practices.png',
  network: '/images/network.png',
  datasets: '/images/datasets.png',
};

const Banner = ({
  section,
}: {
  section: 'geospatial-data' | 'network' | 'practices' | 'datasets';
}) => {
  const [bannerOpen, setBannerOpen] = useState(true);
  const closeBanner = () => {
    setBannerOpen(false);
    localStorage.setItem('ORCASA_DESKTOP_BANNER_CLOSED', 'true');
  };

  const isBannerClosed = localStorage.getItem('ORCASA_DESKTOP_BANNER_CLOSED');
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
        className="absolute -bottom-[60px] -right-8 h-[246px] w-[437px] object-contain pl-[107px]"
        src={images[section]}
      />
    </div>
  );
};

export default Banner;

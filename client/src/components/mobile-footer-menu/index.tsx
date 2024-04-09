'use client';

import { useState } from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';

type FooterButton = {
  label: string;
  count?: number;
  content: React.ReactNode;
};

const Banner = () => {
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
        src="/images/desktop-banner-mockup.png"
      />
    </div>
  );
};

const MobileFooterMenu = ({
  buttons,
  variant = 'light',
}: {
  buttons: FooterButton[];
  variant?: 'dark' | 'light';
}) => {
  return (
    <div className="fixed bottom-0 z-10 h-fit w-full lg:hidden">
      <Banner />
      <nav className="z-20 flex h-full transform divide-x bg-green-700 text-white">
        {buttons.map(({ label, count, content }) => (
          <Drawer key={label}>
            <DrawerTrigger className="flex-1">
              <Button
                variant="vanilla"
                key={label}
                className="flex items-center justify-center gap-2 px-4 py-2.5"
              >
                {label}
                {!!count && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-900 text-sm font-semibold">
                    {count}
                  </span>
                )}
              </Button>
            </DrawerTrigger>
            <DrawerContent variant={variant} className="max-h-[80vh]">
              {content}
            </DrawerContent>
          </Drawer>
        ))}
      </nav>
    </div>
  );
};

export default MobileFooterMenu;

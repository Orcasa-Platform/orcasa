'use client';

import React, { useState } from 'react';

import Autoplay from 'embla-carousel-autoplay';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, LucideIcon } from 'lucide-react';

import Factory from '/public/images/factory.svg';
import HeartHandshake from '/public/images/heart-handshake.svg';
import Landmark from '/public/images/landmark.svg';
import Microscope from '/public/images/microscope.svg';
import Scale from '/public/images/scale.svg';

import { Testimony } from '@/types/generated/strapi.schemas';

import { useTestimonies } from '@/hooks/testimonies';

import {
  Carousel as CarouselComponent,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import ContentLoader from '@/components/ui/loader';

import { Button } from '../ui/button';

const CARD_WIDTH = 373;
const CARD_GAP = 40;

const iconMap: Record<string, LucideIcon> = {
  microscope: Microscope,
  scale: Scale,
  landmark: Landmark,
  factory: Factory,
  'heart handshake': HeartHandshake,
};

const cardVariants = {
  hidden: { opacity: 0, x: '-100%' },
  visible: { opacity: 1, x: 0 },
};

type CardProps = {
  card?: Testimony;
};

const Card = ({ card }: CardProps) => {
  if (!card) return null;
  const { icon, content, name, role } = card;
  const Icon = iconMap[icon];

  return (
    <motion.div
      className="flex h-[444px] min-w-[373px] max-w-[373px] flex-col justify-start gap-6 rounded-lg bg-white p-10 shadow-lg"
      variants={cardVariants}
    >
      <div className="flex items-center justify-start">
        <Icon className="h-10 w-10" />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: content || '' }}
        className="flex-grow text-sm leading-[22px] text-gray-500"
      />
      <div>
        <div className="text-gray-700">{name}</div>
        <div className="font-semibold">{role}</div>
      </div>
    </motion.div>
  );
};

const Carousel = () => {
  const { testimonies, isFetching, isFetched, isPlaceholderData, isError } = useTestimonies();

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonies.length - 1 : prevIndex - 1));
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonies.length - 1 ? 0 : prevIndex + 1));
  };
  return (
    <ContentLoader
      data={testimonies}
      isFetching={isFetching}
      isFetched={isFetched}
      isPlaceholderData={isPlaceholderData}
      isError={isError}
    >
      {/* For lg up */}
      <div className="hidden overflow-hidden shadow lg:block lg:max-w-[50vw] lg:shadow-none">
        <motion.div
          className="flex gap-10 p-6 lg:w-[50vw]"
          animate={{ x: `-${currentIndex * (CARD_WIDTH + CARD_GAP)}px` }}
          transition={{ ease: 'easeInOut' }}
        >
          {testimonies.map((testimony) => (
            <Card key={testimony.id} card={testimony.attributes} />
          ))}
        </motion.div>
      </div>
      {isFetched && testimonies.length > 1 ? (
        <div className="mt-6 hidden gap-2 lg:flex">
          <Button
            variant="icon-primary"
            size="icon-sm"
            onClick={prevCard}
            disabled={currentIndex === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Previous testimony</span>
          </Button>
          <Button
            variant="icon-primary"
            size="icon-sm"
            onClick={nextCard}
            disabled={currentIndex + 1 === testimonies.length}
          >
            <ArrowRight className="w- h-4" />
            <span className="sr-only">Next testimony</span>
          </Button>
        </div>
      ) : null}
      {/* For mobile */}
      <CarouselComponent
        className="block lg:hidden"
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent className="p-1">
          {testimonies.map((testimony) => (
            <CarouselItem key={testimony.id} className="flex justify-center">
              <Card key={testimony.id} card={testimony.attributes} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </CarouselComponent>
    </ContentLoader>
  );
};

export default Carousel;

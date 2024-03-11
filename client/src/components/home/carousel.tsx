'use client';

import React, { useState } from 'react';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Factory,
  HeartHandshake,
  Landmark,
  LucideIcon,
  Microscope,
  Scale,
} from 'lucide-react';

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
      className="flex h-[444px] min-w-[373px] max-w-[373px] flex-col justify-between gap-6 border-b-8 border-yellow-500 bg-white p-10 shadow"
      variants={cardVariants}
    >
      <div className="flex h-12 w-12 items-center justify-center bg-gray-700 p-2">
        <Icon className="h-12 w-12 text-white" />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: content || '' }}
        className="text-sm leading-6 text-gray-700"
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
          className="flex gap-10 lg:w-[50vw]"
          animate={{ x: `-${currentIndex * (CARD_WIDTH + CARD_GAP)}px` }}
          transition={{ ease: 'easeInOut' }}
        >
          {testimonies.map((testimony) => (
            <Card key={testimony.id} card={testimony.attributes} />
          ))}
        </motion.div>
      </div>
      <div className="mt-6 hidden gap-1 lg:flex">
        <Button variant="outline" className="px-3 py-0" onClick={prevCard}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimony</span>
        </Button>
        <Button variant="outline" className="px-3 py-0" onClick={nextCard}>
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next testimony</span>
        </Button>
      </div>
      {/* For mobile */}
      <CarouselComponent className="block lg:hidden">
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

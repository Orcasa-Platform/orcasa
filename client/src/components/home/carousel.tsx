'use client';

import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Microscope,
  // Scale,
  // Landmark,
  // Factory,
  // HeartHandshake,
} from 'lucide-react';

import { Button } from '../ui/button';

const CARD_WIDTH = 373;
const CARD_GAP = 40;

const cards = [
  {
    id: 1,
    Icon: Microscope,
    content:
      '"Thanks to Impact4Soil I will be able to quickly identify relevant scientific publications on soil carbon, and even better, I will have a quantified assessment of the impact of practices on soil carbon. This last point is very important for me, as part of a research organisation, because we are often asked to provide this information by decision-makers and journalists. Knowing that there is a reliable source of scientific information is therefore extremely valuable"',
    name: 'Julien Demenois, France',
    role: 'Senior Researcher',
  },
  // {
  //   id: 2,
  //   Icon: Scale,
  //   content:
  //     '"Thanks to Impact4Soil I will be able to quickly identify relevant scientific publications on soil carbon, and even better, I will have a quantified assessment of the impact of practices on soil carbon. This last point is very important for me, as part of a research organisation, because we are often asked to provide this information by decision-makers and journalists. Knowing that there is a reliable source of scientific information is therefore extremely valuable"',
  //   name: 'Julien Demenois, France',
  //   role: 'Policymaker',
  // },
  // {
  //   id: 3,
  //   Icon: Landmark,
  //   content:
  //     '"Thanks to Impact4Soil I will be able to quickly identify relevant scientific publications on soil carbon, and even better, I will have a quantified assessment of the impact of practices on soil carbon. This last point is very important for me, as part of a research organisation, because we are often asked to provide this information by decision-makers and journalists. Knowing that there is a reliable source of scientific information is therefore extremely valuable"',
  //   name: 'Julien Demenois, France',
  //   role: 'Funding agency',
  // },
  // {
  //   id: 4,
  //   Icon: Factory,
  //   content:
  //     '"Thanks to Impact4Soil I will be able to quickly identify relevant scientific publications on soil carbon, and even better, I will have a quantified assessment of the impact of practices on soil carbon. This last point is very important for me, as part of a research organisation, because we are often asked to provide this information by decision-makers and journalists. Knowing that there is a reliable source of scientific information is therefore extremely valuable"',
  //   name: 'Julien Demenois, France',
  //   role: 'Company',
  // },
  // {
  //   id: 5,
  //   Icon: HeartHandshake,
  //   content:
  //     '"Thanks to Impact4Soil I will be able to quickly identify relevant scientific publications on soil carbon, and even better, I will have a quantified assessment of the impact of practices on soil carbon. This last point is very important for me, as part of a research organisation, because we are often asked to provide this information by decision-makers and journalists. Knowing that there is a reliable source of scientific information is therefore extremely valuable"',
  //   name: 'Julien Demenois, France',
  //   role: 'NGO',
  // },
];

const cardVariants = {
  hidden: { opacity: 0, x: '-100%' },
  visible: { opacity: 1, x: 0 },
};

type CardProps = {
  card: (typeof cards)[0];
};

const Card = ({ card }: CardProps) => {
  const { Icon, content, name, role } = card;
  return (
    <motion.div
      key={card.id}
      className="flex h-[444px] min-w-[373px] max-w-[373px] flex-col justify-between gap-6 border-b-8 border-yellow-500 bg-white p-10 shadow"
      variants={cardVariants}
    >
      <div className="flex h-12 w-12 items-center justify-center bg-gray-700 p-2">
        <Icon className="h-12 w-12 text-white" />
      </div>
      <p className="text-sm leading-6 text-gray-700">{content}</p>
      <div>
        <div className="text-gray-700">{name}</div>
        <div className="font-semibold">{role}</div>
      </div>
    </motion.div>
  );
};

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
  };

  const nextCard = () => {
    setCurrentIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
  };
  return (
    <>
      <div className="max-w-[50vw] overflow-hidden">
        <motion.div
          className="flex w-[50vw] gap-10"
          animate={{ x: `-${currentIndex * (CARD_WIDTH + CARD_GAP)}px` }}
          transition={{ ease: 'easeInOut' }}
        >
          {cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </motion.div>
      </div>
      <div className="mt-6 flex gap-1">
        <Button variant="outline" className="px-3 py-0" onClick={prevCard}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous testimony</span>
        </Button>
        <Button variant="outline" className="px-3 py-0" onClick={nextCard}>
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next testimony</span>
        </Button>
      </div>
    </>
  );
};

export default Carousel;

'use client';

import { useRef } from 'react';

import Image from 'next/image';

import { motion, useTransform, useScroll, useInView } from 'framer-motion';

const images = [
  {
    src: '/images/hero.jpg',
    alt: 'Map demo',
  },
  {
    src: '/images/se.jpg',
    alt: 'Scientific evidence demo',
  },
  {
    src: '/images/network.jpg',
    alt: 'Network demo',
  },
  {
    src: '/images/practices.jpg',
    alt: 'Practices demo',
  },
  {
    src: '/images/datasets.jpg',
    alt: 'Datasets demo',
  },
];

const INITIAL_X = 100;
const IMAGE_WIDTH = 463;

const ImageSlider = () => {
  const { scrollYProgress } = useScroll();
  const ref = useRef(null);

  const inView = useInView(ref);
  const x = useTransform(scrollYProgress, [0, 1], [INITIAL_X, -(images.length - 3) * IMAGE_WIDTH]);
  return (
    <motion.div className="overflow-x-hidden" ref={ref}>
      <motion.div
        className="flex transform items-center justify-center gap-10 transition-transform duration-2000"
        style={{ x: inView ? x : INITIAL_X, width: images.length * IMAGE_WIDTH }}
      >
        {images.map((image) => (
          <Image key={image.src} src={image.src} width={IMAGE_WIDTH} height={300} alt={image.alt} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ImageSlider;

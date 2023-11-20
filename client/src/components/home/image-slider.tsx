'use client';

import { useRef, useEffect } from 'react';

import Image from 'next/image';

import { motion, useTransform, useScroll, useInView } from 'framer-motion';

const images = [
  {
    src: '/images/hero.jpg',
    alt: 'Map demo',
  },
  {
    src: '/images/se.jpg',
    alt: 'Scientific Evidence demo',
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
  const mainScrollElement = useRef<HTMLElement | null>(null);

  const ref = useRef(null);
  const inView = useInView(ref);
  useEffect(() => {
    const mainScroll = document.getElementById('main-scroll');
    mainScrollElement.current = mainScroll;
  }, []);
  const { scrollYProgress } = useScroll({
    container: mainScrollElement,
    layoutEffect: false,
  });

  const x = useTransform(
    scrollYProgress,
    [0.1, 0.2],
    [INITIAL_X, -(images.length - 3) * IMAGE_WIDTH],
  );

  return (
    <motion.div className="overflow-x-hidden" ref={ref}>
      <motion.div
        className="flex items-center justify-center gap-10"
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

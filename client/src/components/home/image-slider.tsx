'use client';

import { useRef, useEffect } from 'react';

import Image from 'next/image';

import { motion, useTransform, useScroll, useInView, useSpring } from 'framer-motion';

const images = [
  {
    src: '/images/geospatial-data.png',
    alt: 'Geospatial data',
  },
  {
    src: '/images/scientific-evidence.png',
    alt: 'Scientific evidence demo',
  },
  {
    src: '/images/network.png',
    alt: 'Network',
  },
  {
    src: '/images/practices.png',
    alt: 'Practices',
  },
  {
    src: '/images/datasets.png',
    alt: 'Datasets',
  },
];

const INITIAL_X = 100;
const IMAGE_WIDTH = 437;

const ImageSlider = () => {
  const mainScrollElement = useRef<HTMLElement | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref);

  const { scrollYProgress } = useScroll({
    container: mainScrollElement,
    target: ref,
    offset: ['end end', 'start start'],
  });

  const x = useTransform(scrollYProgress, [0.2, 0.8], [INITIAL_X, -IMAGE_WIDTH]);

  const scaleX = useSpring(x, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const mainScroll = document.getElementById('main-scroll');
    mainScrollElement.current = mainScroll;
  }, []);

  return (
    <motion.div className="overflow-x-hidden py-16" ref={ref}>
      <motion.div
        className="flex items-center justify-center gap-10"
        style={{ x: inView ? scaleX : INITIAL_X, width: images.length * IMAGE_WIDTH }}
      >
        {images.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            width={IMAGE_WIDTH}
            height={246}
            alt={image.alt}
            className="overflow-hidden rounded-lg shadow-2xl"
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ImageSlider;

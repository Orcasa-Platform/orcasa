'use client';

import { useMemo } from 'react';
import { useRef, useEffect, useState } from 'react';

import Image from 'next/image';

import { motion, useTransform, useScroll, useSpring } from 'framer-motion';

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

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

// Calculate ratio for the total width to keep the last image visible
const getWidthRatio = (windowWidth: number) => {
  if (windowWidth > 1600) {
    return 1.5;
  }

  if (windowWidth > 1300) {
    return 2;
  }

  if (windowWidth > 1023) {
    return 3;
  }

  if (windowWidth > 900) {
    return 2;
  }

  if (windowWidth > 750) {
    return 2.5;
  }

  if (windowWidth > 550) {
    return 3;
  }

  return 4;
};

const ImageSlider = ({ isMobile = false }: { isMobile?: boolean }) => {
  const mainScrollElement = useRef<HTMLElement | null>(null);
  const ref = useRef(null);
  const imageWidth = useMemo<number>(() => (isMobile ? 257 : 437), [isMobile]);

  const [mounted, setMounted] = useState(false);

  const [windowWidth] = useWindowSize();

  const { scrollYProgress } = useScroll({
    container: mainScrollElement,
    // FIXME: hack so that Framer Motion works, otherwise it gives an error related to hydration
    // which can't be fixed even if the component is only mounted client-side (with SSR: false)
    // Related to https://github.com/framer/motion/issues/2483
    target: mounted ? ref : undefined,
    offset: ['end end', 'start start'],
  });

  const x = useTransform(
    scrollYProgress,
    [0.2, 0.8],
    [INITIAL_X, -imageWidth * getWidthRatio(windowWidth)],
  );

  const scaleX = useSpring(x, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const mainScroll = document.getElementById('main-scroll');
    mainScrollElement.current = mainScroll;

    setMounted(true);
  }, []);

  return (
    <div className="overflow-x-hidden py-16" ref={ref}>
      <motion.div
        className="flex items-center justify-center gap-10"
        style={{ x: scaleX, width: images.length * imageWidth }}
      >
        {images.map((image) => (
          <Image
            key={image.src}
            src={image.src}
            width={imageWidth}
            height={isMobile ? 145 : 246}
            alt={image.alt}
            className="overflow-hidden rounded-lg shadow-2xl"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default ImageSlider;

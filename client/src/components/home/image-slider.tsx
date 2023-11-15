'use client';

import { useEffect, useRef } from 'react';

import Image from 'next/image';

import { motion, useTransform, useMotionValue, useInView } from 'framer-motion';

// Component that slides through 5 images on scroll
const ImageSlider = () => {
  const scrollY = useMotionValue(0);
  const ref = useRef(null);
  const inView = useInView(ref);
  useEffect(() => {
    if (inView) {
      const handleScroll = () => {
        scrollY.set(window.scrollY);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [inView, scrollY]);
  // Get scroll height on react

  const x = useTransform(
    scrollY,
    [0, typeof window !== 'undefined' ? document.body.scrollHeight : 0],
    [-1000, 700],
  );

  return (
    <motion.div className="overflow-x-hidden" ref={ref}>
      <motion.div
        className="flex transform items-center justify-center gap-10 transition-transform duration-1000"
        style={{ x }}
      >
        <Image src="/images/hero.jpg" width={463} height={300} alt="Map demo" />
        <Image src="/images/se.jpg" width={463} height={300} alt="Scientific evidence demo" />
        <Image src="/images/network.jpg" width={463} height={300} alt="Network demo" />
        <Image src="/images/practices.jpg" width={463} height={300} alt="Practices demo" />
        <Image src="/images/datasets.jpg" width={463} height={300} alt="Datasets demo" />
      </motion.div>
    </motion.div>
  );
};

export default ImageSlider;

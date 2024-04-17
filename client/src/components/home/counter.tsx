'use client';

import { useEffect, useRef } from 'react';

import { useInView, useMotionValue, useSpring } from 'framer-motion';
import { useMediaMatch } from 'rooks';

export default function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });
  const isMobile = useMediaMatch('(max-width: 1024px)');
  const isInView = useInView(ref, { once: true, margin: isMobile ? '0px' : '-100px' });
  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [motionValue, isInView]);

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = latest.toFixed(0);
        }
      }),
    [springValue],
  );

  return <span ref={ref} />;
}

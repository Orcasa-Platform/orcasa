'use client';
import { useEffect } from 'react';

const ScrollToTop: React.FC = () => {
  useEffect(() => {
    const mainScroll = document.getElementById('main-scroll');
    if (mainScroll) {
      mainScroll.scrollTo(0, 0);
    }
  }, []);

  return null;
};

export default ScrollToTop;

'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';

const ScientificEvidenceBanner = () => {
  const [bannerOpen, setBannerOpen] = useState(true);
  const closeBanner = () => {
    setBannerOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('SCIENTIFIC_EVIDENCE_BANNER_CLOSED', 'true');
    }
  };

  const isBannerClosed =
    typeof window !== 'undefined' && localStorage.getItem('SCIENTIFIC_EVIDENCE_BANNER_CLOSED');

  if (isBannerClosed || !bannerOpen) return null;

  return (
    <div className="se-banner absolute left-[95px] top-[260px] z-40 flex h-[76px] w-[196px] items-center justify-center shadow">
      <svg
        className="absolute -left-1 top-[32px]"
        width="6"
        height="12"
        viewBox="0 0 6 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 6.375L6 0.375L6 11.625L0 6.375Z" fill="#2BB3A7" />
      </svg>
      <div className="flex h-full gap-2 rounded border-l-4 border-green-700 bg-gradient-to-r from-green-700 to-cyan-600 px-3 py-2 text-xs leading-5 text-white">
        <div>
          <span>See the </span>
          <span className="font-semibold">impact</span>
          <span> of different types of interventions on soil carbon.</span>
        </div>
        <Button variant="vanilla" className="h-4 !px-0 hover:opacity-50" onClick={closeBanner}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 4L4 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 4L12 12" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
      </div>
    </div>
  );
};
export default ScientificEvidenceBanner;

'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { Module } from '@/constants/modules';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type ScientificEvidenceNavTooltipProps = PropsWithChildren<{
  navSlug: Module['slug'];
}>;

const ScientificEvidenceNavTooltip = ({ navSlug, children }: ScientificEvidenceNavTooltipProps) => {
  const pathname = usePathname();
  const isPractices = pathname?.startsWith('/practices');

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const closeTooltip = useCallback(() => {
    setTooltipOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('SCIENTIFIC_EVIDENCE_BANNER_CLOSED', 'true');
    }
  }, []);

  useEffect(() => {
    setTooltipOpen(localStorage.getItem('SCIENTIFIC_EVIDENCE_BANNER_CLOSED') !== 'true');
  }, []);

  if (!isPractices || navSlug !== 'scientific-evidence') {
    return children;
  }

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={22}
          variant="gradient"
          className="flex w-[200px] gap-x-2"
        >
          <div>
            <span>See the </span>
            <span className="font-semibold">impact</span>
            <span> of different types of interventions on soil carbon.</span>
          </div>
          <Button variant="vanilla" className="h-4 !px-0 hover:opacity-50" onClick={closeTooltip}>
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
          <TooltipArrow variant="gradient" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
export default ScientificEvidenceNavTooltip;

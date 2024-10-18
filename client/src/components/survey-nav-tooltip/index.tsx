'use client';

import { PropsWithChildren, useCallback, useEffect, useState } from 'react';

import env from '@/env.mjs';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type SurveyNavTooltipProps = PropsWithChildren;

const SurveyNavTooltip = ({ children }: SurveyNavTooltipProps) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const closeTooltip = useCallback(() => {
    setTooltipOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('SURVEY_TOOLTIP_CLOSED', 'true');
    }
  }, []);

  useEffect(() => {
    const shouldBeOpen = localStorage.getItem('SURVEY_TOOLTIP_CLOSED') !== 'true';
    const isTimeLimited = !!env.NEXT_PUBLIC_SURVEY_TOOLTIP_EXPANDED_UNTIL;
    const isStillExpanded = isTimeLimited
      ? +new Date() < +new Date(env.NEXT_PUBLIC_SURVEY_TOOLTIP_EXPANDED_UNTIL)
      : false;

    setTooltipOpen(shouldBeOpen && isStillExpanded);
  }, []);

  return (
    <TooltipProvider>
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger asChild onClick={() => setTooltipOpen(true)}>
          {children}
        </TooltipTrigger>
        <TooltipContent
          side="right"
          sideOffset={22}
          align="end"
          variant="gradient"
          className="flex w-[360px] flex-wrap gap-2"
        >
          <p className="flex-grow font-serif text-base">Help us improve Impact4Soil</p>
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
          <div className="basis-full">
            Share your feedback or your contact details by filling out the{' '}
            <a
              href="https://groupes.renater.fr/limesurvey/index.php/622186"
              className="font-semibold"
              target="_blank"
              rel="noreferrer noopener"
            >
              survey
            </a>{' '}
            or emailing us at{' '}
            <a href="mailto:impact4soil@groupes.renater.fr" className="font-semibold">
              impact4soil@groupes.renater.fr
            </a>
          </div>
          <TooltipArrow variant="gradient" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SurveyNavTooltip;

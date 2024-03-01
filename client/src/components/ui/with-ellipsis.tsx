import { useState } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
  TooltipProvider,
} from '@/components/ui/tooltip';

const WithEllipsis = ({ text, maxLength = 35 }: { text: string; maxLength?: number }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const handleTooltipClick = () => setTooltipOpen((prevOpen) => !prevOpen);

  if (text?.length < maxLength) return text;

  const triggerText = text && `${text.slice(0, maxLength)}...`;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger
          className="cursor-default"
          onMouseEnter={() => setTooltipOpen(true)}
          onMouseLeave={() => setTooltipOpen(false)}
          onClick={handleTooltipClick}
        >
          {triggerText}
        </TooltipTrigger>
        <TooltipContent className="text-sm leading-7" variant="dark">
          {text}
          <TooltipArrow variant="dark" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export { WithEllipsis };

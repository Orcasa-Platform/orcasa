import { useState } from 'react';

import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from '@radix-ui/react-tooltip';

const WithEllipsis = ({ text, maxLength = 35 }: { text: string; maxLength?: number }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (text?.length < maxLength) return text;

  const triggerText = text && `${text.slice(0, maxLength)}...`;
  return (
    <Tooltip open={tooltipOpen}>
      <TooltipTrigger
        className="cursor-default"
        onMouseEnter={() => setTooltipOpen(true)}
        onMouseLeave={() => setTooltipOpen(false)}
      >
        {triggerText}
      </TooltipTrigger>
      <TooltipContent
        align="center"
        side="bottom"
        className="z-50 max-w-[300px] bg-white p-1 text-center text-xs text-slate-700"
      >
        {text}
        <TooltipArrow className="z-50 fill-secondary" width={10} height={5} />
      </TooltipContent>
    </Tooltip>
  );
};

export { WithEllipsis };

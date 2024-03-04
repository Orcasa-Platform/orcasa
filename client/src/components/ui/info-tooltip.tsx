import React from 'react';

import { cn } from '@/lib/classnames';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipArrow,
  TooltipProvider,
} from '@/components/ui/tooltip';

const InfoTooltip = ({
  triggerContent,
  content,
  triggerClassName,
  className,
  sideOffset,
}: {
  triggerContent: React.ReactNode;
  content: React.ReactNode;
  className?: string;
  triggerClassName?: string;
  sideOffset?: number;
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger className={triggerClassName}>{triggerContent}</TooltipTrigger>
        <TooltipContent
          className={cn('text-sm leading-7', className)}
          variant="dark"
          sideOffset={sideOffset}
        >
          {content}
          <TooltipArrow variant="dark" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;

import { Button } from '@/components/ui/button';

import { useState } from 'react';

import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import InfoButtonIcon from '/public/images/info.svg';

export default function InfoButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [openInfo, setInfoOpen] = useState(false);
  const handleInfoClick = () => setInfoOpen((prevOpen) => !prevOpen);

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0} open={openInfo} onOpenChange={setInfoOpen}>
        <TooltipTrigger asChild onClick={handleInfoClick}>
          <Button type="button" size="icon-xs" variant="icon" className={className}>
            <span className="sr-only">Info</span>
            <InfoButtonIcon className="h-4 w-4 text-white" />
          </Button>
        </TooltipTrigger>
        <TooltipContent variant="dark" className="max-w-[400px] text-sm leading-5">
          {children}
          <TooltipArrow variant="dark" className="-ml-3" />
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

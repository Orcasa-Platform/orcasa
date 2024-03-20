'use client';

import * as React from 'react';

import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipArrow } from '@/components/ui/tooltip';

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn('relative flex w-full touch-none select-none items-center', className)}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-500">
        <SliderPrimitive.Range className="absolute h-full bg-green-700" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="group focus-visible:outline-none">
        <Tooltip open={tooltipOpen}>
          <TooltipTrigger
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
            asChild
          >
            <div className="block h-4 w-4 rounded-full border-2 border-slate-800 bg-background ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 group-focus-visible:ring-2 group-focus-visible:ring-green-700"></div>
          </TooltipTrigger>
          <TooltipContent
            variant="dark"
            align="center"
            side="bottom"
            className="z-50 w-10 p-1 text-center text-xs"
          >
            {(Number(props.value) * 100).toFixed(0)}%
            <TooltipArrow variant="dark" className="z-50" width={10} height={5} />
          </TooltipContent>
        </Tooltip>
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider;

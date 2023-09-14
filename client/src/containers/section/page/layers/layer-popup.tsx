import { PopoverArrow } from '@radix-ui/react-popover';
import { Info, X } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger, PopoverClose } from '@/components/ui/popover';

export default function LayerPopup({ children }: { children: React.ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button aria-label="Info button" type="button" className="hover:text-gray-500">
          <Info className="stroke-current" />
        </button>
      </PopoverTrigger>

      <PopoverContent side="top" align="start" className="flex min-w-[500px] flex-col space-y-2">
        {children}
        <PopoverClose className="absolute right-4 top-4" aria-label="Close">
          <X className="h-6 w-6" />
        </PopoverClose>
        <PopoverArrow className="fill-white" width={10} height={5} />
      </PopoverContent>
    </Popover>
  );
}

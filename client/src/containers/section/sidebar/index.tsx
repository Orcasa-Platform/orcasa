'use client';

import { PropsWithChildren } from 'react';

import { ChevronLeft } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { sidebarOpenAtom } from '@/store';

import { mapSettingsAtom } from '@/store/index';

import { Button } from '@/components/ui/button';

export default function Sidebar({ children }: PropsWithChildren) {
  const open = useRecoilValue(sidebarOpenAtom);
  const setOpen = useSetRecoilState(sidebarOpenAtom);
  const { basemap } = useRecoilValue(mapSettingsAtom);
  const variants: { [key: typeof basemap]: 'opener-light' | 'opener-dark' } = {
    'basemap-light': 'opener-dark',
    'basemap-satellite': 'opener-light',
  };

  return (
    <div
      className={cn({
        'absolute left-[117px] top-0 flex h-full w-full max-w-[487px] flex-col bg-white shadow-lg transition-transform duration-500':
          true,
        'translate-x-0': open,
        '-translate-x-full': !open,
      })}
    >
      <div className="absolute left-full top-0 z-10">
        <Button
          variant={variants[basemap]}
          size="icon"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ChevronLeft
            className={cn({
              'h-6 w-6 transition-transform': true,
              'rotate-180': !open,
            })}
          />
        </Button>
      </div>

      <div className="flex grow flex-col overflow-y-auto">{children}</div>
    </div>
  );
}

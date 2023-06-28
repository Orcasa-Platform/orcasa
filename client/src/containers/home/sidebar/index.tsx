'use client';

import { PropsWithChildren } from 'react';

import { ChevronLeft } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { sidebarOpenAtom } from '@/store';

import { Button } from '@/components/ui/button';

export default function Sidebar({ children }: PropsWithChildren) {
  const open = useRecoilValue(sidebarOpenAtom);
  const setOpen = useSetRecoilState(sidebarOpenAtom);

  return (
    <div
      className={cn({
        'absolute left-0 top-0 flex h-full w-full max-w-[400px] flex-col bg-white shadow-lg transition-transform duration-500':
          true,
        'translate-x-0': open,
        '-translate-x-full': !open,
      })}
    >
      <div className="absolute left-full top-6 z-10">
        <Button
          variant="default"
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

      <div className="prose flex grow flex-col overflow-y-auto">{children}</div>
    </div>
  );
}

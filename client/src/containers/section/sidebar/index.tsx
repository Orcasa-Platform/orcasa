'use client';

import { ChevronLeft } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { sidebarOpenAtom } from '@/store';

import { Section } from '@/types/app';

import { useTheme } from '@/hooks/ui/theme';

import { Button } from '@/components/ui/button';
type OpenerVariant = 'opener-dark' | 'opener-light';

export default function Sidebar({
  children,
  section,
}: {
  children: React.ReactNode;
  section: Section;
}) {
  const open = useRecoilValue(sidebarOpenAtom);
  const setOpen = useSetRecoilState(sidebarOpenAtom);
  const variant: OpenerVariant = useTheme('opener');
  const maxWidth = () => {
    const sectionMaxWidth: Partial<Record<Section, string>> = {
      'geospatial-data': 'max-w-[35%]',
      practices: 'max-w-[58%]',
      network: 'max-w-[58%]',
    };
    return sectionMaxWidth[section] ?? '';
  };

  return (
    <div
      className={cn({
        'absolute left-[117px] top-0 flex h-full w-full flex-col bg-white shadow-lg transition-transform duration-500':
          true,
        [maxWidth()]: true,
        'translate-x-0': open,
        '-translate-x-full': !open,
      })}
    >
      <div className="absolute left-full top-0 z-10">
        <Button
          variant={variant}
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

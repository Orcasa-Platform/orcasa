'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { usePracticesFilterSidebarOpen } from '@/store/practices';

import { Button } from '@/components/ui/button';

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = usePracticesFilterSidebarOpen();

  const scrollableContainerRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Move the focus to the close button when the sidebar is opened
  useEffect(() => {
    if (filterSidebarOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [filterSidebarOpen]);

  // When the user reopens the sidebar, make sure it's scrolled to the top
  useEffect(() => {
    if (filterSidebarOpen && scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({ top: 0 });
    }
  }, [filterSidebarOpen, scrollableContainerRef]);

  return (
    <div
      // `inert` is not yet supported by React so that's why it is spread below:
      // https://github.com/facebook/react/issues/17157
      {...(!filterSidebarOpen ? { inert: '' } : {})}
      className={cn('absolute left-full top-0 -z-10 h-full w-[380px] bg-white duration-500', {
        '-translate-x-full': !filterSidebarOpen,
        'translate-x-0': filterSidebarOpen,
      })}
    >
      <div
        ref={scrollableContainerRef}
        className="flex h-full flex-col gap-y-10 overflow-y-auto p-12"
      >
        <Button
          ref={closeButtonRef}
          type="button"
          variant="primary"
          size="icon"
          className="absolute right-0 top-0"
          onClick={() => setFilterSidebarOpen(false)}
        >
          <span className="sr-only">Close</span>
          <X className="h-6 w-6" />
        </Button>
        <h1 className="font-serif text-3.8xl">Filters</h1>
        <div className="flex flex-col gap-y-10">Coming soon</div>
      </div>
    </div>
  );
}

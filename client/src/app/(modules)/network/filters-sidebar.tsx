'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useFilterSidebarOpen } from './store';

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = useFilterSidebarOpen();

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  // Move the focus to the close button when the sidebar is opened
  useEffect(() => {
    if (filterSidebarOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [filterSidebarOpen]);

  if (!filterSidebarOpen) {
    return null;
  }

  return (
    <div className="absolute left-[calc(min(45%,_860px)_+_117px)] top-0 h-full w-[380px] border-l border-gray-200 bg-white p-12">
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
    </div>
  );
}

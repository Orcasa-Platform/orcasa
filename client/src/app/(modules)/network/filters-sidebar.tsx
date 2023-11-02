'use client';

import { useEffect, useRef } from 'react';

import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

import { useFilterSidebarOpen, useFilters } from './store';

export default function FiltersSidebar() {
  const [filterSidebarOpen, setFilterSidebarOpen] = useFilterSidebarOpen();
  const [filters, setFilters] = useFilters();

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
    <div className="absolute left-[calc(min(45%,_860px)_+_117px)] top-0 flex h-full w-[380px] flex-col gap-y-10 border-l border-gray-200 bg-white p-12">
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
      <fieldset className="flex flex-col gap-y-4">
        <legend className="mb-4 font-semibold">Type</legend>
        <div className="flex items-center gap-x-2">
          <Checkbox
            id="filter-organization"
            checked={filters.type.includes('organization')}
            onCheckedChange={(checked) =>
              setFilters({
                ...filters,
                type: checked
                  ? [...filters.type, 'organization']
                  : filters.type.filter((filter) => filter !== 'organization'),
              })
            }
          />
          <Label htmlFor="filter-organization">Organizations</Label>
        </div>
        <div className="flex items-center gap-x-2">
          <Checkbox
            id="filter-project"
            checked={filters.type.includes('project')}
            onCheckedChange={(checked) =>
              setFilters({
                ...filters,
                type: checked
                  ? [...filters.type, 'project']
                  : filters.type.filter((filter) => filter !== 'project'),
              })
            }
          />
          <Label htmlFor="filter-project">Projects</Label>
        </div>
      </fieldset>
    </div>
  );
}

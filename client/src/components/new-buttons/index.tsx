'use client';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';

const NewButtons = ({ className }: { className?: string }) => (
  <div className={cn('ml-4 space-x-4', className)}>
    <Button asChild>
      <Link href="/network/new/organisation">
        <Plus className="mr-2 h-6 w-6" />
        <div className="text-base">Organisation</div>
      </Link>
    </Button>
    <Button
      disabled
      onClick={() => {
        // TODO - add elements
      }}
    >
      <Plus className="mr-2 h-6 w-6" />
      <div className="text-base">Project</div>
    </Button>
  </div>
);
export default NewButtons;

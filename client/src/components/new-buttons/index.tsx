'use client';

import Link from 'next/link';

import { Plus } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';

const NewButtons = ({ className }: { className?: string }) => (
  <div className={cn('space-x-4', className)}>
    <Button asChild>
      <Link href="/network/new/organisation">
        <Plus className="mr-2 h-4 w-4" />
        Organisation
      </Link>
    </Button>
    <Button asChild>
      <Link href="/network/new/initiative">
        <Plus className="mr-2 h-4 w-4" />
        Initiative
      </Link>
    </Button>
  </div>
);
export default NewButtons;

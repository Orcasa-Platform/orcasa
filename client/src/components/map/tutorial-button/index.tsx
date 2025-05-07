import { ExternalLink } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';

export default function TutorialButton({ href, className }: { href: string; className?: string }) {
  return (
    <Button variant="outline-dark" size="xs" asChild>
      <a href={href} target="_blank" rel="noreferrer" className={cn('!mt-0', className)}>
        <span>Watch tutorial</span>
        <ExternalLink className="ml-2 h-4 w-4" />
      </a>
    </Button>
  );
}

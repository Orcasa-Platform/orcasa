import React, { useState, useMemo, Children, isValidElement } from 'react';

import { ChevronUp } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import SortableList from './sortable/list';
import { LegendProps } from './types';

export const Legend: React.FC<LegendProps> = ({
  children,
  className = '',
  sortable,
  onChangeOrder,
  hideToggle,
}: LegendProps) => {
  const [opened, setOpened] = useState(true);

  const hasChildren = useMemo(() => {
    return !!Children.count(Children.toArray(children).filter((c) => isValidElement(c)));
  }, [children]);

  if (!hasChildren) {
    return null;
  }

  return (
    <Collapsible
      open={opened}
      onOpenChange={setOpened}
      className={cn({
        'relative flex grow flex-col': true,
        [className]: !!className,
      })}
    >
      {!hideToggle && (
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="legend"
            size="xs"
            className={cn(
              'self-end rounded-lg font-medium hover:bg-gray-500 focus-visible:ring-offset-0',
              {
                'rounded-b-none': opened,
              },
            )}
          >
            <ChevronUp
              className={cn('mr-2 h-4 w-4 transition-transform duration-200', {
                'rotate-180': opened,
              })}
            />
            <span className="text-2xs tracking-wide">{opened ? 'Hide legend' : 'Show legend'}</span>
          </Button>
        </CollapsibleTrigger>
      )}
      <CollapsibleContent className="relative -mx-1 flex h-full flex-col overflow-hidden rounded-lg rounded-tr-none">
        <div className="overflow-y-auto overflow-x-hidden px-1">
          {!!sortable.enabled && !!onChangeOrder && (
            <SortableList sortable={sortable} onChangeOrder={onChangeOrder}>
              {children}
            </SortableList>
          )}

          {!sortable.enabled && children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default Legend;

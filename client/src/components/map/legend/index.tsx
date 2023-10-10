import React, { useState, useMemo, Children, isValidElement } from 'react';

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
}: LegendProps) => {
  const [opened, setOpened] = useState(false);

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
      <CollapsibleTrigger asChild>
        <Button type="button" variant="primary" size="xs" className="self-end">
          {opened ? 'Hide legend' : 'Show legend'}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="relative flex h-full flex-col overflow-hidden">
        <div className="overflow-y-auto overflow-x-hidden">
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

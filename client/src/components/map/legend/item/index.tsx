'use client';

import React, { Children, PropsWithChildren, isValidElement, useMemo } from 'react';

import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { LegendItemProps } from '@/components/map/legend/types';
import { Button } from '@/components/ui/button';

import LegendItemToolbar from './toolbar';

export const LegendItem: React.FC<PropsWithChildren & LegendItemProps> = ({
  children,
  name,
  className = '',
  // sortable
  sortable,
  // attributes,
  listeners,
  // settings
  settingsManager,
  settings,
  // events
  onChangeOpacity,
  onChangeVisibility,
  onRemove,
}) => {
  const validChildren = useMemo(() => {
    const chldn = Children.map(children, (Child) => {
      return isValidElement(Child);
    });
    return chldn && chldn.some((c) => !!c);
  }, [children]);

  return (
    <div
      className={cn({
        'mb-px w-full bg-white font-sans shadow': true,
        [className]: !!className,
      })}
    >
      <header className="sticky top-0 z-10 flex items-start justify-between space-x-2 border-t border-slate-200 bg-white p-2">
        <div
          className={cn({
            'relative flex items-start space-x-2': true,
            '-ml-1': sortable?.handle,
          })}
        >
          {sortable?.handle && (
            <Button type="button" variant="vanilla" size="icon-sm" {...listeners}>
              <span className="sr-only">Click and drag to reorder</span>
              <GripVertical className="h-5 w-5" />
            </Button>
          )}

          <div className="text-base font-semibold text-gray-800">{name}</div>
        </div>

        {/* TOOLBAR */}
        <LegendItemToolbar
          settings={settings}
          settingsManager={settingsManager}
          onChangeOpacity={onChangeOpacity}
          onChangeVisibility={onChangeVisibility}
          onRemove={onRemove}
        />
      </header>

      {validChildren && <div className="px-2 pb-2">{children}</div>}
    </div>
  );
};

export default LegendItem;

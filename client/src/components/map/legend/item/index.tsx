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
  position,
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
        'w-full rounded-lg rounded-tr-none bg-white font-sans shadow': true,
        'rounded-t-none': position === 'middle' || position === 'last',
        'rounded-b-none': position === 'first' || position === 'middle',
        [className]: !!className,
      })}
    >
      <header
        className={cn(
          'sticky top-0 z-10 flex items-start justify-between space-x-2 rounded-lg border-t border-slate-200 bg-white p-3',
          {
            'border-t-0': position === 'first' || position === 'only',
            'rounded-t-none': position === 'middle' || position === 'last',
            'rounded-b-none': position === 'first' || position === 'middle',
          },
        )}
      >
        <div
          className={cn({
            'relative flex items-start space-x-2': true,
            '-ml-1': sortable?.handle,
          })}
        >
          {sortable?.handle && (
            <Button type="button" variant="vanilla" size="icon-xs" {...listeners}>
              <span className="sr-only">Click and drag to reorder</span>
              <GripVertical className="h-4 w-4" />
            </Button>
          )}

          <div className="text-xs font-semibold leading-5 text-gray-700">{name}</div>
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

      {validChildren && <div className="px-3 pb-3">{children}</div>}
    </div>
  );
};

export default LegendItem;

'use client';

import React, { Children, PropsWithChildren, isValidElement, useMemo } from 'react';

import { GripVertical } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { LegendItemProps } from '@/components/map/legend/types';
import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion';

import LegendItemToolbar from './toolbar';

export const LegendItem: React.FC<PropsWithChildren & LegendItemProps> = ({
  id,
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
  // components
  info,
  // events
  onChangeOpacity,
  onChangeVisibility,
  onChangeExpand,
}) => {
  const { expand } = settings || {};

  const validChildren = useMemo(() => {
    const chldn = Children.map(children, (Child) => {
      return isValidElement(Child);
    });
    return chldn && chldn.some((c) => !!c);
  }, [children]);

  const acordionState = expand ? `${id}` : undefined;

  return (
    <Accordion type="single" value={acordionState} asChild>
      <AccordionItem value={`${id}`} asChild>
        <div
          className={cn({
            'mb-1 w-full border border-slate-200 border-t-transparent': true,
            [className]: !!className,
          })}
        >
          <header className="sticky top-0 z-10 flex items-start justify-between space-x-8 border-t border-slate-200 bg-white px-2.5 py-2.5">
            <div
              className={cn({
                'relative flex items-start space-x-0.5': true,
                '-ml-1': sortable?.handle,
              })}
            >
              {sortable?.handle && (
                <button
                  aria-label="drag"
                  type="button"
                  className="text-primary hover:text-primary/50 mt-0.5 cursor-pointer transition-colors"
                  {...listeners}
                >
                  <GripVertical className="h-5 w-5" />
                </button>
              )}

              <div
                className={cn({
                  'text-primary mt-px text-sm font-semibold': true,
                })}
              >
                {name}
              </div>
            </div>

            {/* TOOLBAR */}
            <LegendItemToolbar
              settings={settings}
              settingsManager={settingsManager}
              onChangeOpacity={onChangeOpacity}
              onChangeVisibility={onChangeVisibility}
              onChangeExpand={onChangeExpand}
              info={info}
            />
          </header>

          {validChildren && (
            <AccordionContent className="grow bg-white px-2.5 transition-all">
              <div className="">{children}</div>
            </AccordionContent>
          )}
        </div>
      </AccordionItem>
    </Accordion>
  );
};

export default LegendItem;

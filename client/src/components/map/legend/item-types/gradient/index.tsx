import React from 'react';

import { cn } from '@/lib/classnames';

import { LegendTypeProps } from '../../types';

export const LegendTypeGradient: React.FC<LegendTypeProps> = ({ className = '', unit, items }) => {
  return (
    <div
      className={cn({
        [className || '']: !!className,
      })}
    >
      {!!unit && <div className="mb-1 flex justify-end text-xs text-gray-500">{unit}</div>}
      <div
        className="flex h-4 w-full"
        style={{
          backgroundImage: `linear-gradient(to right, ${items.map((i) => i.color).join(',')})`,
        }}
      />

      <ul className="mt-3 flex w-full justify-between">
        {items
          .filter(({ value }) => typeof value !== 'undefined' && value !== null)
          .map(({ value }) => (
            <li
              key={`${value}`}
              className={cn({
                'relative flex-shrink-0 text-xs text-gray-500 before:absolute before:-top-2 before:left-1/2':
                  true,
                'before:block before:h-1 before:w-px before:bg-gray-800 first-of-type:before:left-0 last-of-type:before:left-auto last-of-type:before:right-0':
                  value !== undefined && value !== null,
              })}
            >
              {value}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default LegendTypeGradient;

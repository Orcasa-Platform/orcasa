import React from 'react';

import { cn } from '@/lib/classnames';

import { LegendTypeProps } from '../../types';

export const LegendTypeBasic: React.FC<LegendTypeProps> = ({ className = '', items = [] }) => {
  return (
    <div
      className={cn({
        [className]: !!className,
      })}
    >
      <ul className="mt-0.5 flex flex-wrap gap-x-4 gap-y-2">
        {items.map(({ value, color }) => (
          <li
            key={`${value}`}
            className={cn({
              'flex space-x-2 text-2xs': true,
              'basis-[calc(50%_-_theme(space.2))]': items.length > 1,
            })}
          >
            <div
              className="relative top-0.5 h-3 w-3 flex-shrink-0 rounded-full"
              style={{
                backgroundColor: color,
              }}
            />
            <div>{value}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegendTypeBasic;

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
      <ul className="flex w-full flex-col space-y-1">
        {items.map(({ value, color }) => (
          <li key={`${value}`} className="flex space-x-2 text-xs">
            <div
              className="mt-1 h-2 w-2 flex-shrink-0 border border-slate-500"
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

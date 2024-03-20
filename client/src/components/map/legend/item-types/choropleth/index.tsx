import React from 'react';

import { cn } from '@/lib/classnames';

import { LegendTypeProps } from '../../types';

export const LegendTypeChoropleth: React.FC<LegendTypeProps> = ({
  className = '',
  unit,
  items,
}) => {
  return (
    <div
      className={cn({
        [className]: !!className,
      })}
    >
      {!!unit && <div className="mb-1 flex justify-end text-2xs text-gray-500">{unit}</div>}
      <ul className="flex w-full">
        {items.map(({ color }) => (
          <li
            key={`${color}`}
            className="h-4 flex-shrink-0"
            style={{
              width: `${100 / items.length}%`,
              backgroundColor: color,
            }}
          />
        ))}
      </ul>

      <ul className="mt-3 flex w-full">
        {items.map(({ value }) => (
          <li
            key={`${value}`}
            className={cn({
              'relative flex-shrink-0 text-center text-2xs text-gray-500': true,
              'before:absolute before:-top-2 before:left-1/2 before:block before:h-1 before:w-px before:bg-gray-700':
                value !== undefined && value !== null,
            })}
            style={{
              width: `${100 / items.length}%`,
            }}
          >
            {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LegendTypeChoropleth;

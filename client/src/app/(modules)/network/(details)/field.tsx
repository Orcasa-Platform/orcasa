'use client';

import { useRef, useState } from 'react';

import { cn } from '@/lib/classnames';

import { useIsOverTwoLines } from './hooks';

type Type = 'project' | 'organization';
type Field = {
  label: string;
  value: string | (string | undefined)[] | undefined;
  url?: string | string[];
  hasEllipsis?: boolean;
};

const Field = ({ label, value, url, type, hasEllipsis }: Field & { type: Type }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverTwoLines = useIsOverTwoLines(ref, hasEllipsis);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderLink = (url: string | string[]) =>
    Array.isArray(url) ? (
      <div>
        {url.map(
          (u, i) =>
            value?.[i] && (
              <>
                {i !== 0 ? ', ' : ''}
                <a
                  key={u}
                  href={u}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-peach-700"
                >
                  {value[i]}
                </a>
              </>
            ),
        )}
      </div>
    ) : (
      <a href={url} target="_blank" rel="noreferrer" className="text-sm text-peach-700">
        {value}
      </a>
    );

  return (
    <div className="flex gap-6">
      <div
        className={cn('text-sm font-semibold', {
          'w-[224px] min-w-[224px]': type === 'project',
          'w-[144px] min-w-[144px]': type === 'organization',
        })}
      >
        {label}
      </div>
      {url ? (
        renderLink(url)
      ) : (
        <div>
          <div
            ref={ref}
            className={cn('text-sm', {
              'line-clamp-2': !isExpanded && isOverTwoLines,
            })}
          >
            {value}
          </div>
          {isOverTwoLines && (
            <button onClick={toggleExpanded} className="text-sm font-semibold text-mod-sc-ev">
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Field;

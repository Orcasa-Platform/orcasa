/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';

import { cn } from '@/lib/classnames';
import { FormatProps, format as formatFunction } from '@/lib/utils/formats';

import { useIsOverTwoLines } from '@/hooks/ui/utils';

export type FieldType = {
  label: string;
  value: string | (string | undefined)[] | undefined;
  url?: string | string[];
  hasEllipsis?: boolean;
  logo?: boolean;
  formatId?: FormatProps['id'];
};

const Field = ({ label, value, url, hasEllipsis, logo, formatId }: FieldType) => {
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
                  className="text-sm text-brown-500"
                >
                  {formatId ? formatFunction({ id: formatId, value: value[i] }) : value[i]}
                </a>
              </>
            ),
        )}
      </div>
    ) : (
      <a href={url} target="_blank" rel="noreferrer" className="text-sm text-peach-700">
        {formatId ? formatFunction({ id: formatId, value }) : value}
      </a>
    );

  const renderField = () => {
    if (logo) {
      if (value === 'WOCAT')
        return <img className="h-6 w-[110px]" src="/assets/logos/wocat.png" alt="WOCAT logo" />;
    }

    return url ? (
      renderLink(url)
    ) : (
      <div>
        <div
          ref={ref}
          className={cn('text-sm', {
            'line-clamp-2': !isExpanded && isOverTwoLines,
          })}
        >
          {formatId ? formatFunction({ id: formatId, value }) : value}
        </div>
        {isOverTwoLines && (
          <button onClick={toggleExpanded} className="text-sm font-semibold text-brown-500">
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };
  return (
    <div className="flex gap-6">
      <div className="w-[224px] min-w-[224px] text-sm font-semibold">{label}</div>
      {renderField()}
    </div>
  );
};

export default Field;

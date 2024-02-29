'use client';

import { useRef, useState } from 'react';

import Link from 'next/link';

import { cn } from '@/lib/classnames';

import { useIsOverTwoLines } from '@/hooks/ui/utils';

import MarkdownRenderer from '@/components/home/markdown-renderer';

type Type = 'project' | 'organization';
type Field = {
  label: string;
  value: string | (string | undefined)[] | undefined;
  url?: string | string[];
  external?: boolean;
  hasEllipsis?: boolean;
  markup?: boolean;
};

const Field = ({
  label,
  value,
  url,
  external,
  type,
  hasEllipsis,
  markup,
}: Field & { type: Type }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverTwoLines = useIsOverTwoLines(ref, hasEllipsis);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderLink = (url: string | string[], external = false) => {
    if (!external) {
      return (
        <Link className="text-sm text-peach-700" href={`${url}`}>
          {value}
        </Link>
      );
    }
    return Array.isArray(url) ? (
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
  };

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
        renderLink(url, external)
      ) : (
        <div>
          {markup ? (
            <MarkdownRenderer
              variant="lists"
              className={cn('text-sm', {
                'line-clamp-2': !isExpanded && isOverTwoLines,
              })}
              content={value as string}
              ref={ref}
            />
          ) : (
            <div
              ref={ref}
              className={cn('text-sm', {
                'line-clamp-2': !isExpanded && isOverTwoLines,
              })}
            >
              {value}
            </div>
          )}
          {isOverTwoLines && (
            <button
              onClick={toggleExpanded}
              className={cn('text-sm font-semibold', {
                'text-blue-500': type === 'organization',
                'text-peach-700': type === 'project',
              })}
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Field;

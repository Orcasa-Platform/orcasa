/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';

import Link from 'next/link';

import { ExternalLink } from 'lucide-react';

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

const FieldLink = ({
  url,
  external,
  children,
}: {
  url: string;
  external?: boolean;
  children: React.ReactNode;
}) =>
  external ? (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-semibold leading-7 text-purple-400"
    >
      {children}
      <ExternalLink className="ml-2 inline h-4 w-4 min-w-fit" />
    </a>
  ) : (
    <Link className="text-sm font-semibold leading-7 text-purple-400" href={`${url}`}>
      {children}
    </Link>
  );

const Field = ({ label, value, url, hasEllipsis, logo, formatId }: FieldType) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverTwoLines = useIsOverTwoLines(ref, hasEllipsis);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderLink = (url: string | string[], external = false) => {
    return Array.isArray(url) ? (
      <div className="flex flex-col gap-3">
        {url.map(
          (elemUrl, index) =>
            value?.[index] && (
              <FieldLink key={elemUrl} url={`${elemUrl}`} external={external}>
                {value[index]}
              </FieldLink>
            ),
        )}
      </div>
    ) : (
      <FieldLink external={external} url={url}>
        {value}
      </FieldLink>
    );
  };

  const renderField = () => {
    if (logo) {
      if (value === 'WOCAT') {
        return <img className="h-6 w-[110px]" src="/assets/logos/wocat.png" alt="WOCAT logo" />;
      } else if (value === 'FAO') {
        return <img className="h-[44px]" src="/assets/logos/fao.svg" alt="FAO logo" />;
      }
    }

    return url ? (
      renderLink(url)
    ) : (
      <div>
        <div
          ref={ref}
          className={cn('text-sm text-gray-200', {
            'line-clamp-2': !isExpanded && isOverTwoLines,
          })}
        >
          {formatId ? formatFunction({ id: formatId, value }) : value}
        </div>
        {isOverTwoLines && (
          <button onClick={toggleExpanded} className="text-sm font-semibold">
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };
  return (
    <div className="flex gap-6">
      <div className="w-[224px] min-w-[224px] text-sm">{label}</div>
      {renderField()}
    </div>
  );
};

export default Field;

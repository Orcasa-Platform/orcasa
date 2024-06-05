/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef, useState } from 'react';

import Link from 'next/link';

import { ExternalLink } from 'lucide-react';

import InfoButton from '/public/images/info-dark.svg';

import { useIsOverTwoLines } from '@/hooks/ui/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/classnames';
import { FormatProps, format as formatFunction } from '@/lib/utils/formats';

export type FieldType = {
  label: string;
  description?: string;
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
    <Link className="text-sm font-semibold text-purple-400" href={`${url}`}>
      {children}
    </Link>
  );

const Field = ({ label, value, description, url, hasEllipsis, logo, formatId }: FieldType) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverTwoLines = useIsOverTwoLines(ref, hasEllipsis);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const [openInfo, setInfoOpen] = useState(false);
  const handleInfoClick = () => setInfoOpen((prevOpen) => !prevOpen);

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
        <div className="flex items-center space-x-2">
          <div
            ref={ref}
            className={cn('text-sm text-gray-200', {
              'line-clamp-2': !isExpanded && isOverTwoLines,
            })}
          >
            {formatId ? formatFunction({ id: formatId, value }) : value}
          </div>
          {description && (
            <TooltipProvider>
              <Tooltip delayDuration={0} open={openInfo} onOpenChange={setInfoOpen}>
                <TooltipTrigger asChild onClick={handleInfoClick}>
                  <Button type="button" size="auto" variant="icon">
                    <span className="sr-only">Info</span>
                    <InfoButton className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent variant="dark" className="max-w-[293px] text-sm leading-7">
                  {description}
                  <TooltipArrow variant="dark" className="-ml-3" />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        {isOverTwoLines && (
          <button onClick={toggleExpanded} className="text-sm font-semibold text-purple-400">
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-6">
      <div className="w-[128px] min-w-[128px] text-sm lg:w-[224px] lg:min-w-[224px]">{label}</div>
      {renderField()}
    </div>
  );
};

export default Field;

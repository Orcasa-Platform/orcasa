'use client';

import { useRef, useState } from 'react';

import Link from 'next/link';

import InfoButton from 'public/images/info-dark.svg';

import { cn } from '@/lib/classnames';

import { useIsOverTwoLines } from '@/hooks/ui/utils';

import MarkdownRenderer from '@/components/home/markdown-renderer';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Type = 'project' | 'organization';
type Field = {
  label: string;
  value: string | (string | undefined)[] | undefined;
  url?: string | string[];
  external?: boolean;
  hasEllipsis?: boolean;
  markup?: boolean;
  description?: string;
};

const Field = ({
  label,
  value,
  url,
  external,
  type,
  hasEllipsis,
  markup,
  description,
}: Field & { type: Type }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const isOverTwoLines = useIsOverTwoLines(ref, hasEllipsis);
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const renderSingleLink = (url: string, external = false) => {
    if (!external) {
      return (
        <Link className="text-sm font-semibold text-purple-400" href={`${url}`}>
          {value}
        </Link>
      );
    } else {
      return (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-purple-400"
        >
          {value}
        </a>
      );
    }
  };

  const renderLinkArray = (url: Array<string>, external = false) => {
    if (!external) {
      return (
        <div>
          {url.map(
            (elemUrl, index) =>
              value?.[index] && (
                <>
                  {index !== 0 ? <br /> : ''}
                  <Link
                    key={elemUrl}
                    className="text-sm font-semibold text-purple-400"
                    href={`${elemUrl}`}
                  >
                    {value[index]}
                  </Link>
                </>
              ),
          )}
        </div>
      );
    } else {
      return (
        <div>
          {url.map(
            (elemUrl, index) =>
              value?.[index] && (
                <>
                  {index !== 0 ? <br /> : ''}
                  <a
                    key={elemUrl}
                    href={elemUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-purple-400"
                  >
                    {value[index]}
                  </a>
                </>
              ),
          )}
        </div>
      );
    }
  };

  const renderLink = (url: string | string[], external = false) => {
    return Array.isArray(url) ? renderLinkArray(url, external) : renderSingleLink(url, external);
  };

  const [openInfo, setInfoOpen] = useState(false);
  const handleInfoClick = () => setInfoOpen((prevOpen) => !prevOpen);

  return (
    <div className="flex gap-6">
      <div
        className={cn('shrink-0 text-sm', {
          'w-[160px]': type === 'project',
          'w-[144px]': type === 'organization',
        })}
      >
        {label}
      </div>
      {url ? (
        renderLink(url, external)
      ) : (
        <div className="text-gray-200">
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
            <div className="flex items-center space-x-2">
              <div
                ref={ref}
                className={cn('text-sm', {
                  'line-clamp-2': !isExpanded && isOverTwoLines,
                })}
              >
                {value}
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
          )}
          {isOverTwoLines && (
            <Button
              type="button"
              variant="vanilla"
              size="auto"
              onClick={toggleExpanded}
              className="font-semibold text-purple-400"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Field;

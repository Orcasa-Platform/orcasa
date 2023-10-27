/* eslint-disable @next/next/no-img-element */
import { useCallback } from 'react';

import { cn } from '@/lib/classnames';

import { useMapSettings } from '@/store/index';

export interface BasemapItemProps {
  alt: string;
  value: string;
  preview: string;
}

const BasemapItem = ({ alt, value, preview }: BasemapItemProps) => {
  const [{ basemap }, setMapSettings] = useMapSettings();

  const handleToggleBasemap = useCallback(() => {
    setMapSettings((prev) => ({
      ...prev,
      basemap: value,
    }));
  }, [value, setMapSettings]);

  return (
    <div className="flex w-full items-center justify-between space-x-8">
      <button className="group grow" type="button" onClick={handleToggleBasemap}>
        <div className="space-y-2">
          <div
            className={cn({
              'shrink-0 overflow-hidden transition-opacity': true,
              'group-hover:opacity-75 group-active:outline group-active:outline-2 group-active:outline-slate-400':
                true,
              'outline outline-2 outline-offset-4 outline-yellow-500 group-hover:opacity-100 group-active:outline-slate-500':
                value === basemap,
            })}
          >
            <img src={preview} alt={alt} width={104} height={104} className="w-full" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default BasemapItem;

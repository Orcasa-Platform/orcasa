import { useCallback } from 'react';

import Image from 'next/image';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { mapSettingsAtom } from '@/store/index';

export interface BasemapItemProps {
  label: string;
  value: string;
  preview: string;
}

const BasemapItem = ({ label, value, preview }: BasemapItemProps) => {
  const { basemap } = useRecoilValue(mapSettingsAtom);
  const setMapSettings = useSetRecoilState(mapSettingsAtom);

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
              'shrink-0 overflow-hidden rounded transition-opacity': true,
              'group-hover:opacity-75 group-active:outline group-active:outline-2 group-active:outline-slate-400':
                true,
              'outline outline-2 outline-slate-500 group-hover:opacity-100 group-active:outline-slate-500':
                value === basemap,
            })}
          >
            <Image src={preview} alt={label} width={96} height={64} className="w-full rounded" />
          </div>

          <span
            className={cn({
              'block text-sm font-light text-slate-500 transition-colors': true,
              'group-hover:text-slate-400': true,
              'group-hover:text-slate-500': value === basemap,
            })}
          >
            {label}
          </span>
        </div>
      </button>
    </div>
  );
};

export default BasemapItem;

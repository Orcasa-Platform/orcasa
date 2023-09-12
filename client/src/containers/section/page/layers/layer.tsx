'use client';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { layersAtom } from '@/store';

import { LayerGroupLayersDataItem } from '@/types/generated/strapi.schemas';

import { Switch } from '@/components/ui/switch';

import LayerPopup from './layer-popup';

export default function Layer({ id, attributes }: LayerGroupLayersDataItem) {
  const layers = useRecoilValue(layersAtom);
  const setLayers = useSetRecoilState(layersAtom);

  if (!id) return null;

  const handleLayerChange = () => {
    if (!id) return;
    // Toogle layers if they exist
    if (layers.includes(id)) {
      return setLayers(layers.filter((l) => l !== id));
    }

    // Add layers if they don't exist
    if (!layers.includes(id)) {
      return setLayers([id, ...layers]);
    }
  };

  const { title } = attributes || {};
  const isChecked = layers.includes(id);
  return (
    <li
      key={id}
      className={cn(
        'flex h-[144px] w-full flex-col items-start justify-start space-y-4 p-6 transition-colors',
        {
          'bg-gray-50': !isChecked,
          'bg-yellow-50': isChecked,
        },
      )}
    >
      <div className="w-full space-y-2">
        <header className="flex w-full items-center justify-between">
          <h4 className="text-base font-semibold">{title}</h4>
          <div className="flex items-center justify-between space-x-4">
            <LayerPopup>
              <div className="text-base font-semibold">{title}</div>
            </LayerPopup>
            <Switch checked={layers.includes(id)} onCheckedChange={handleLayerChange} />
          </div>
        </header>
        <p className="text-base">Domain... TBD</p>
      </div>
      <div>
        <span className="mr-2 text-base">Data source:</span>
        <a
          href="#"
          className="inline-block text-base font-semibold text-amber-500 underline"
          target="_blank"
          rel="noreferrer noopener"
        >
          TBD
        </a>
      </div>
    </li>
  );
}

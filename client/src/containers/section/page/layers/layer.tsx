'use client';

import { Info } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { layersAtom } from '@/store';

import { LayerGroupLayersDataItem } from '@/types/generated/strapi.schemas';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

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
  return (
    <li key={id} className="mb-4 space-y-2.5 bg-yellow-50 p-6">
      <header className="flex justify-between space-x-2.5 py-1 pl-2">
        <h4 className="font-serif text-lg leading-7">{title}</h4>
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Info className="relative h-6 w-6 hover:fill-white hover:stroke-slate-500" />
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
              <div className="font-serif text-2xl leading-10">{title}</div>
              <div className="text-sm">Description</div>
            </DialogContent>
          </Dialog>
          <Switch
            checked={layers.includes(id)}
            onCheckedChange={handleLayerChange}
            color="yellow"
          />
        </div>
      </header>
    </li>
  );
}

'use client';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { layersAtom } from '@/store';

import { LayerListResponseDataItem } from '@/types/generated/strapi.schemas';

import { Switch } from '@/components/ui/switch';

export default function LayersItem({ id, attributes }: Required<LayerListResponseDataItem>) {
  const layers = useRecoilValue(layersAtom);
  const setLayers = useSetRecoilState(layersAtom);

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

  return (
    <li key={id} className="space-y-2.5">
      <header className="flex justify-between space-x-2.5 py-1 pl-2">
        <h4>{attributes.title}</h4>

        <Switch checked={layers.includes(id)} onCheckedChange={handleLayerChange} />
      </header>
    </li>
  );
}

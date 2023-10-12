'use client';

import { Info } from 'lucide-react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { layersAtom } from '@/store';

import { LayerGroupLayersDataItem } from '@/types/generated/strapi.schemas';

import { Button } from '@/components/ui/button';
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

  const {
    title,
    description,
    license,
    citation,
    cautions,
    related_publications,
    resource_contact_name,
    resource_contact_url,
    metadata_contact_name,
    metadata_contact_url,
    source,
    source_url,
  } = attributes || {};

  interface Field {
    key: string;
    value: string;
    url?: string;
  }

  const fields: Field[] = [
    { key: 'License', value: license || '' },
    { key: 'Citation', value: citation || '' },
    { key: 'Cautions', value: cautions || '' },
    { key: 'Related publications', value: related_publications || '' },
    { key: 'Resource Contact', value: resource_contact_name || '', url: resource_contact_url },
    { key: 'Metadata Contact', value: metadata_contact_name || '', url: metadata_contact_url },
    { key: 'Source', value: source || '', url: source_url },
  ].filter((f) => f.value !== '');
  const renderField = ({ key, value, url }: Field) => {
    if (!key || !value) return null;
    return (
      <div className="flex gap-10 text-sm">
        <div className="w-[134px] min-w-[134px] font-semibold">{key}</div>
        {url ? (
          <a href={url} target="_blank" rel="noreferrer" className="font-semibold text-yellow-500">
            {value}
          </a>
        ) : (
          <div className="whitespace-pre-wrap">{value}</div>
        )}
      </div>
    );
  };
  const isActive = layers.includes(id);
  return (
    <li
      key={id}
      className={cn('mb-4 space-y-4 bg-yellow-50 p-6', { 'bg-slate-700 text-white': isActive })}
    >
      <header className="flex justify-between space-x-2.5 py-1 pl-2">
        <h4 className="font-serif text-lg leading-7">{title}</h4>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="vanilla" size="asChild" className={cn({ 'text-white': isActive })}>
                <span className="sr-only">Info button</span>
                <Info className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
              <div className="font-serif text-2xl leading-10">{title}</div>
              <div className="whitespace-pre-wrap text-sm">{description}</div>
              {fields.map(renderField)}
            </DialogContent>
          </Dialog>
          <Switch checked={layers.includes(id)} onCheckedChange={handleLayerChange} />
        </div>
      </header>
      <div className="flex justify-end">
        <a
          href={source_url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-yellow-500 hover:text-yellow-300"
        >
          {source}
        </a>
      </div>
    </li>
  );
}

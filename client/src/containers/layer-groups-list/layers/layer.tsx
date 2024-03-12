'use client';

import { ReactElement, cloneElement, useCallback, useMemo } from 'react';

import Info from 'public/images/info.svg';

import { cn } from '@/lib/classnames';
import { JSON_CONFIGURATION, parseConfig } from '@/lib/json-converter';

import { useLayers, useLayersSettings } from '@/store';

import { LayerGroupLayersDataItem } from '@/types/generated/strapi.schemas';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';

interface Field {
  key: string;
  value: string;
  url?: string;
}

const renderField = ({ key, value, url }: Field) => {
  if (!key || !value) return null;
  return (
    <div key={key} className="flex gap-10 text-sm">
      <div className="w-[134px] min-w-[134px] font-semibold">{key}</div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-green-700 hover:underline"
        >
          {value}
        </a>
      ) : (
        <div className="whitespace-pre-wrap">{value}</div>
      )}
    </div>
  );
};

export default function Layer({ id, attributes = {} }: LayerGroupLayersDataItem) {
  const [layers, setLayers] = useLayers();
  const [layersSettings, setLayersSettings] = useLayersSettings();

  const fields: Field[] = useMemo(
    () =>
      [
        { key: 'License', value: attributes.license ?? '' },
        { key: 'Citation', value: attributes.citation ?? '' },
        { key: 'Cautions', value: attributes.cautions ?? '' },
        { key: 'Related publications', value: attributes.related_publications ?? '' },
        {
          key: 'Resource Contact',
          value: attributes.resource_contact_name ?? '',
          url: attributes.resource_contact_url,
        },
        {
          key: 'Metadata Contact',
          value: attributes.metadata_contact_name ?? '',
          url: attributes.metadata_contact_url,
        },
        { key: 'Source', value: attributes.source ?? '', url: attributes.source_url },
      ].filter((f) => f.value !== ''),
    [attributes],
  );

  const handleLayerChange = useCallback(() => {
    if (!id) return;
    // Toogle layers if they exist
    if (layers.includes(id)) {
      return setLayers(layers.filter((l) => l !== id));
    }

    // Add layers if they don't exist
    if (!layers.includes(id)) {
      return setLayers([id, ...layers]);
    }
  }, [id, layers, setLayers]);

  const isActive = id && layers.includes(id);

  const sourceLink = (
    <a
      href={attributes.source_url}
      target="_blank"
      rel="noreferrer"
      className={cn({
        'text-[10px] font-semibold hover:underline': true,
        'text-green-700': !isActive,
        'text-white': isActive,
      })}
    >
      {attributes.source}
    </a>
  );

  const layerSettings = useMemo(() => {
    if (!id || !attributes.ui_settings) {
      return null;
    }

    const component = parseConfig<ReactElement | null>({
      config: attributes.ui_settings,
      params_config: attributes.params_config,
      settings: layersSettings[id] ?? { opacity: 1, visibility: true },
      jsonConfiguration: JSON_CONFIGURATION,
    });

    if (component) {
      return cloneElement(component, {
        paramsConfig: attributes.params_config,
        sourceLink,
        onChangeSettings: (settings: Record<string, unknown>) =>
          setLayersSettings((previousSettings) => ({
            ...previousSettings,
            [id]: {
              ...(previousSettings[id] ?? {}),
              ...settings,
            },
          })),
      });
    }

    return component;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, id, layersSettings, setLayersSettings]);

  if (!id) return null;
  return (
    <li key={id} className={cn('flex flex-col p-2', {})}>
      <header className="flex items-center justify-between gap-x-4 text-gray-700">
        <div className="flex items-center gap-2">
          <Switch checked={layers.includes(id)} onCheckedChange={handleLayerChange} />
          <h4 className="text-[10px] leading-[14px]">{attributes.title}</h4>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="vanilla" size="auto" className={cn({ 'text-grey-700': isActive })}>
              <span className="sr-only">Info button</span>
              <Info className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <div className="font-serif text-2xl leading-10">{attributes.title}</div>
            <div className="whitespace-pre-wrap text-sm">{attributes.description}</div>
            {fields.map(renderField)}
          </DialogContent>
        </Dialog>
      </header>
      {isActive && layerSettings}
    </li>
  );
}

import { Fragment, useCallback } from 'react';

import Image from 'next/image';

import { useMapSettings } from '@/store';

import { BASEMAPS } from '@/constants/basemaps';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Basemaps = () => {
  const [{ basemap }, setMapSettings] = useMapSettings();

  const onChange = useCallback(
    (basemapValue: string) => {
      setMapSettings((prev) => ({
        ...prev,
        basemap: basemapValue,
      }));
    },
    [setMapSettings],
  );

  return (
    <fieldset>
      <legend className="w-full border-b border-gray-200 pb-1 font-serif text-lg">
        Basemap style
      </legend>
      <RadioGroup
        value={basemap}
        onValueChange={onChange}
        className="mt-4 flex justify-between gap-x-2 px-1 pt-1"
      >
        {BASEMAPS.map((basemap) => (
          <Fragment key={basemap.value}>
            <RadioGroupItem
              value={basemap.value}
              id={basemap.value}
              variant="naked"
              className="cursor-pointer overflow-hidden"
            >
              <Image src={basemap.preview} alt={basemap.alt} width={80} height={72} />
            </RadioGroupItem>
            <Label variant={'default'} className="sr-only text-base" htmlFor={basemap.value}>
              {basemap.alt}
            </Label>
          </Fragment>
        ))}
      </RadioGroup>
    </fieldset>
  );
};

export default Basemaps;

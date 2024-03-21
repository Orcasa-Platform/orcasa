import { useCallback } from 'react';

import { useMapSettings } from '@/store/index';

import { BOUNDARIES } from '@/constants/basemaps';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

const Boundaries = () => {
  const [{ boundaries }, setMapSettings] = useMapSettings();

  const onChange = useCallback(
    (boundariesSlug: string) => {
      setMapSettings((prev) => ({
        ...prev,
        boundaries: boundariesSlug,
      }));
    },
    [setMapSettings],
  );

  const onToggle = useCallback(
    (toggled: boolean) => {
      setMapSettings((prev) => ({
        ...prev,
        boundaries: toggled ? BOUNDARIES[0].slug : null,
      }));
    },
    [setMapSettings],
  );

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between border-b border-gray-150 pb-1">
        <Label htmlFor="boundaries-switch" className="font-serif text-lg">
          Boundaries
        </Label>
        <Switch id="boundaries-switch" checked={boundaries !== null} onCheckedChange={onToggle} />
      </div>
      <RadioGroup
        value={boundaries ?? BOUNDARIES[0].slug}
        onValueChange={onChange}
        disabled={boundaries === null}
        className="flex gap-4"
      >
        {BOUNDARIES.map(({ label: boundary, slug }) => (
          <div key={slug} className="group flex cursor-pointer items-center space-x-2">
            <RadioGroupItem value={slug} id={`boundaries-${slug}`} />
            <Label
              variant={boundaries === null ? 'disabled' : 'default'}
              className="text-base"
              htmlFor={`boundaries-${slug}`}
            >
              {boundary}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Boundaries;

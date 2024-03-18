import { useCallback } from 'react';

import { useMapSettings } from '@/store/index';

import { LABELS } from '@/constants/basemaps';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

const Labels = () => {
  const [{ labels }, setMapSettings] = useMapSettings();

  const onChange = useCallback(
    (labelsSlug: string) => {
      setMapSettings((prev) => ({
        ...prev,
        labels: labelsSlug,
      }));
    },
    [setMapSettings],
  );

  const onToggle = useCallback(
    (toggled: boolean) => {
      setMapSettings((prev) => ({
        ...prev,
        labels: toggled ? LABELS[0].slug : null,
      }));
    },
    [setMapSettings],
  );

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center justify-between border-b border-gray-150 pb-1">
        <Label htmlFor="labels-switch" className="font-serif text-lg">
          Labels
        </Label>
        <Switch id="labels-switch" checked={labels !== null} onCheckedChange={onToggle} />
      </div>
      <RadioGroup
        value={labels ?? LABELS[0].slug}
        onValueChange={onChange}
        disabled={labels === null}
        className="flex gap-4"
      >
        {LABELS.map(({ label, slug }) => (
          <div key={slug} className="group flex cursor-pointer items-center space-x-2">
            <RadioGroupItem value={slug} id={slug} />
            <Label
              variant={labels === null ? 'disabled' : 'default'}
              className="text-base"
              htmlFor={slug}
            >
              {label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Labels;

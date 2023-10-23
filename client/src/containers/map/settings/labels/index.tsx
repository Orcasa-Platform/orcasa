import { useCallback } from 'react';

import { useMapSettings } from '@/store/index';

import { LABELS } from '@/constants/basemaps';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const Labels = () => {
  const [{ labels }, setMapSettings] = useMapSettings();

  const handleChange = useCallback(
    (v: string) => {
      setMapSettings((prev) => ({
        ...prev,
        labels: v,
      }));
    },
    [setMapSettings],
  );

  return (
    <RadioGroup value={labels} onValueChange={handleChange} className="gap-3">
      {LABELS.map((l) => (
        <div key={l.slug} className="group flex cursor-pointer items-center space-x-2">
          <RadioGroupItem value={l.slug} id={l.slug} />
          <Label
            className="cursor-pointer font-light transition-colors group-hover:text-slate-400"
            htmlFor={l.slug}
          >
            {l.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
};

export default Labels;

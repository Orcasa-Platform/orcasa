import { useCallback } from 'react';

import { useMapSettings } from '@/store/index';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Labels = () => {
  const [{ labels }, setMapSettings] = useMapSettings();

  const onToggle = useCallback(
    (toggled: boolean) => {
      setMapSettings((prev) => ({
        ...prev,
        labels: toggled,
      }));
    },
    [setMapSettings],
  );

  return (
    <div className="flex w-full items-center justify-between">
      <Label htmlFor="labels-switch" className="font-serif text-lg">
        Labels
      </Label>
      <Switch id="labels-switch" checked={labels} onCheckedChange={onToggle} />
    </div>
  );
};

export default Labels;

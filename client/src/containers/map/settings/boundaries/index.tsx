import { useCallback } from 'react';

import { useMapSettings } from '@/store/index';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const Boundaries = () => {
  const [{ boundaries }, setMapSettings] = useMapSettings();

  const onToggle = useCallback(
    (toggled: boolean) => {
      setMapSettings((prev) => ({
        ...prev,
        boundaries: toggled,
      }));
    },
    [setMapSettings],
  );

  return (
    <div className="flex w-full items-center justify-between">
      <Label htmlFor="boundaries-switch" className="font-serif text-lg">
        Boundaries
      </Label>
      <Switch id="boundaries-switch" checked={boundaries} onCheckedChange={onToggle} />
    </div>
  );
};

export default Boundaries;

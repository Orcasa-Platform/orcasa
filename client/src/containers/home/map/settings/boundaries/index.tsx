import { useCallback } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { mapSettingsAtom } from '@/store/index';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Boundaries = () => {
  const { boundaries } = useRecoilValue(mapSettingsAtom);
  const setMapSettings = useSetRecoilState(mapSettingsAtom);

  const handleChange = useCallback(
    (v: boolean) => {
      setMapSettings((prev) => ({
        ...prev,
        boundaries: v,
      }));
    },
    [setMapSettings]
  );

  return (
    <div className="group flex grow items-center space-x-2">
      <Checkbox id="boundaries-checkbox" checked={boundaries} onCheckedChange={handleChange} />

      <Label
        className="cursor-pointer font-light transition-colors group-hover:text-slate-400"
        htmlFor="boundaries-checkbox"
      >
        Boundaries
      </Label>
    </div>
  );
};

export default Boundaries;

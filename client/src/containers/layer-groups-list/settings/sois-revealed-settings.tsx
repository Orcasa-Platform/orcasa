import { useMemo } from 'react';

import { cn } from '@/lib/classnames';

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
export interface SoilsRevealedSettings {
  depth: {
    label?: number;
    value: number;
  };
  timeFrame: {
    label?: number;
    value: number;
  };
  tabs: Record<string, string>;
  scenarios: Record<string, string>;
  onChangeSettings: (settings: Record<string, unknown>) => unknown;
  sourceLink: JSX.Element;
}

const SoilsRevealedSettings: React.FC<SoilsRevealedSettings> = ({
  timeFrame,
  depth,
  tabs,
  scenarios,
  onChangeSettings,
  sourceLink,
}) => {
  const tabOptions = useMemo(
    () =>
      tabs &&
      Object.entries(tabs)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([label, value]) => ({
          label: label,
          value: value,
        })),
    [tabs],
  );
  const scenarioOptions = useMemo(
    () =>
      scenarios &&
      Object.entries(scenarios)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([label, value]) => ({
          label: label,
          value: value,
        })),
    [scenarios],
  );

  return (
    <>
      <div className="flex items-center justify-between gap-x-4">
        {tabs && (
          <Tabs
            defaultValue={tabOptions[0].value}
            onValueChange={(value) => onChangeSettings({ tilesURL: [value] })}
          >
            <TabsList>
              {tabOptions.map(({ label, value }) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        {scenarios && (
          <Select
            value={scenarioOptions[0].value}
            onValueChange={(value) => onChangeSettings({ tilesURL: [value] })}
          >
            <SelectTrigger id="scenarios" className="h-12 w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {scenarioOptions.map(({ label, value }) => (
                <SelectItem key={value} value={value} className="w-full">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {!timeFrame.label && <div>{timeFrame?.value}</div>}
      </div>
      <div
        className={cn('flex ', {
          'justify-between': depth?.value || timeFrame?.label,
          'justify-end': !depth?.value && !timeFrame?.label,
        })}
      >
        {timeFrame?.label && (
          <div>
            <span className="font-semibold">{timeFrame.label}: </span>
            {timeFrame?.value}
          </div>
        )}
        {depth?.value}
        {sourceLink}
      </div>
    </>
  );
};

export default SoilsRevealedSettings;

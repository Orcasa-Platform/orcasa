import { useMemo } from 'react';

import { cn } from '@/lib/classnames';

import { LegendConfig } from '@/types/layers';

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
  interaction?: Record<string, { url: string; events: unknown[] }>;
  scenarios: Record<string, string>;
  legends?: Record<string, LegendConfig>;
  onChangeSettings: (settings: Record<string, unknown>) => unknown;
  sourceLink: JSX.Element;
  tilesURL: string[];
}

const SoilsRevealedSettings: React.FC<SoilsRevealedSettings> = ({
  depth,
  timeFrame,
  tilesURL,
  tabs,
  scenarios,
  legends,
  interaction,
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
          value: value?.[0],
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
          value: value?.[0],
        })),
    [scenarios],
  );

  const handleValueChange = (value: string) => {
    const label = (tabOptions || scenarioOptions)?.find(({ value: v }) => v === value)?.label;
    const legendAttributes = label && {
      legendType: legends?.[label]?.type,
      legendUnit: legends?.[label]?.unit,
      legendItems: legends?.[label]?.items,
    };
    const interactionAttributes = label && {
      interactionUrl: interaction?.[label]?.url,
      interactionEvents: interaction?.[label]?.events,
    };
    onChangeSettings({
      tilesURL: [value],
      ...(legends && legendAttributes ? legendAttributes : {}),
      ...(interaction && interactionAttributes ? interactionAttributes : {}),
    });
  };

  return (
    <>
      <div className="flex items-center justify-between gap-x-4">
        {tabs && (
          <Tabs defaultValue={tilesURL?.[0]} onValueChange={handleValueChange}>
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
          <Select value={tilesURL?.[0]} onValueChange={handleValueChange}>
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

import { useMemo } from 'react';

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
    <div className="ml-9 space-y-2 text-2xs tracking-wide text-gray-500">
      <div className="mt-2">
        {timeFrame?.label ? (
          <>
            {timeFrame.label}: {timeFrame?.value}
          </>
        ) : (
          [timeFrame?.value, depth?.value].filter(Boolean).join(', ')
        )}
      </div>
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
        <>
          <label htmlFor="scenarios" className="mb-1 block">
            Intervention
          </label>
          <Select value={tilesURL?.[0]} onValueChange={handleValueChange}>
            <SelectTrigger variant="small" id="scenarios" className="w-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent variant="small">
              {scenarioOptions.map(({ label, value }) => (
                <SelectItem variant="small" key={value} value={value} className="w-full">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}
    </div>
  );
};

export default SoilsRevealedSettings;

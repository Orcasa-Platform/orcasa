import { useMemo } from 'react';

import { cn } from '@/lib/classnames';

import {
  Tabs,
  // TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
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
  onChangeSettings: (settings: Record<string, unknown>) => unknown;
  sourceLink: JSX.Element;
}

const SoilsRevealedSettings: React.FC<SoilsRevealedSettings> = ({
  timeFrame,
  depth,
  tabs,
  onChangeSettings,
  sourceLink,
}) => {
  const options = useMemo(
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

  return (
    <>
      <div className="flex items-center justify-between gap-x-4">
        {tabs && (
          <Tabs
            defaultValue={options[0].value}
            onValueChange={(value) => onChangeSettings({ tilesURL: [value] })}
          >
            <TabsList>
              {options.map(({ label, value }) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
            {/* {options.map(({ label, value }) => (
              <TabsContent key={value} value={value}>
                {label}
              </TabsContent>
            ))} */}
          </Tabs>
        )}
        {timeFrame?.value}
      </div>
      <div
        className={cn('flex ', { 'justify-between': depth?.value, 'justify-end': !depth?.value })}
      >
        {depth?.value}
        {sourceLink}
      </div>
    </>
  );
};

export default SoilsRevealedSettings;

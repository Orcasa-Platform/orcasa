export type Bbox = [number, number, number, number];

export const LEGEND_TYPE = ['basic', 'choropleth', 'gradient'] as const;

export type LegendType = (typeof LEGEND_TYPE)[number];

export type Legend = {
  type: LegendType;
  title: string;
  info?: string;
  description?: string;
  items?: { color: string; value: string }[];
  intersections?: { id: number; color: string }[];
};

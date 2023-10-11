import { useEffect, useState } from 'react';

import { Source, Layer, GeoJSONSourceRaw } from 'react-map-gl';

import { Config, LayerProps } from '@/types/layers';

export type BoundsLayerProps = LayerProps & {
  config: Config;
  beforeId?: string;
};

// We need to use staging to test the PR. But we can remove it when is tested.
const API_URL: string =
  'https://staging.orcasa.dev-vizzuality.com' || process.env.NEXT_PUBLIC_API_URL;

const BoundsLayer = ({ id, beforeId }: BoundsLayerProps) => {
  const [bounds, setBounds] = useState<number[]>();
  useEffect(() => {
    fetch(`${API_URL}/qgis/?SERVICE=WFS&&REQUEST=GetFeature&TypeName=S2_TILE_T31TCJ`)
      .then((res) => res.text())
      .then((xml) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, 'application/xml');
        const lowerCorner = doc.querySelector('lowerCorner');
        const upperCorner = doc.querySelector('upperCorner');
        if (!lowerCorner || !upperCorner) {
          // eslint-disable-next-line no-console
          console.warn('No bounds in XML');
          return;
        }
        const lowerCornerText = lowerCorner?.textContent?.trim();
        const upperCornerText = upperCorner?.textContent?.trim();
        const [minx, miny] = lowerCornerText?.split(' ').map(parseFloat) || [];
        const [maxx, maxy] = upperCornerText?.split(' ').map(parseFloat) || [];
        setBounds([minx, miny, maxx, maxy]);
      });
  }, []);
  const data = {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [bounds?.[1], bounds?.[0]],
          [bounds?.[1], bounds?.[2]],
          [bounds?.[3], bounds?.[2]],
          [bounds?.[3], bounds?.[0]],
          [bounds?.[1], bounds?.[0]],
        ],
      ],
    },
  } as unknown as GeoJSONSourceRaw;

  const SOURCE = {
    id,
    type: 'geojson',
    data,
  };

  const STYLES = [
    {
      id: 'bounds-layer',
      type: 'line',
      paint: {
        'line-color': '#ccc',
        'line-width': 2,
        'line-dasharray': [2, 2],
      },
    },
  ];

  if (!SOURCE || !STYLES) return null;

  return (
    <Source {...SOURCE}>
      {STYLES.map((layer) => (
        <Layer key={layer.id} {...layer} beforeId={beforeId} />
      ))}
    </Source>
  );
};

export default BoundsLayer;

import { useMemo } from 'react';

import { AttributionControl } from 'react-map-gl';

import { usePathname } from 'next/navigation';

import { useLayers } from '@/store';

import { useGetLayers } from '@/types/generated/layer';

const Attributions = () => {
  const pathname = usePathname();
  const isGeospatialDataPage = pathname?.includes('geospatial-data');

  const [layers] = useLayers();

  const { data } = useGetLayers(
    {
      fields: ['id', 'source'],
      filters: {
        id: {
          $in: layers,
        },
      },
      sort: 'source',
    },
    {
      query: {
        enabled: isGeospatialDataPage && layers.length > 0,
      },
    },
  );

  const attributions = useMemo(() => {
    if (!!data) {
      const sources = Array.from(
        new Set(data.data?.map(({ attributes }) => attributes?.source)) ?? [],
      );

      return sources.reduce((res, name, index) => {
        const isFirst = index === 0;
        const isLast = index + 1 === sources.length;

        let content = name;
        if (name === 'RW' || name === 'ResourceWatch' || name === 'Resource Watch') {
          content = `<a href="https://resourcewatch.org/" rel="noopener noreferrer">${name}</a>`;
        } else if (
          name === 'GFW' ||
          name === 'GlobalForestWatch' ||
          name === 'Global Forest Watch'
        ) {
          content = `<a href="https://www.globalforestwatch.org/" rel="noopener noreferrer">${name}</a>`;
        }

        if (isFirst) {
          return `${res}${content}`;
        } else {
          if (!isLast) {
            return `${res}, ${content}`;
          } else {
            return `${res} and ${content}`;
          }
        }
      }, 'Powered by ');
    }

    return '';
  }, [data]);

  return <AttributionControl key={attributions} customAttribution={attributions} />;
};

export default Attributions;

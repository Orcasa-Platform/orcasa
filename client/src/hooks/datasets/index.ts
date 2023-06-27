'use client';

import { useMemo } from 'react';

import { group } from 'd3-array';

import { useGetDatasets } from '@/types/generated/dataset';

export const useDatasetsGroups = () => {
  const query = useGetDatasets({ populate: '*' });
  const data = query.data;

  const GROUPED_DATA = useMemo(() => {
    if (!data?.data) return [];

    return (
      Array
        // group by parent
        .from(
          group(
            data.data,
            (d) => d.attributes?.dataset_group?.data?.attributes?.title || 'No parent'
          ),
          ([key, value]) => ({ key, value })
        )
        // sort by key
        .sort((a, b) => a.key.localeCompare(b.key))
    );
  }, [data]);

  return {
    ...query,
    groups: GROUPED_DATA,
  };
};

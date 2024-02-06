import { useMemo } from 'react';

import { PointFeature } from 'supercluster';

import { PracticesDropdownFilters, PracticesFilters } from '@/store/practices';

import { useGetCountries } from '@/types/generated/country';
import { useGetLandUseTypes } from '@/types/generated/land-use-type';
import {
  useGetPracticesInfinite,
  useGetPractices,
  useGetPracticesId,
} from '@/types/generated/practice';
import { useGetPracticeInterventions } from '@/types/generated/practice-intervention';
import {
  PracticeResponse,
  PracticeListResponse,
  PracticeListResponseDataItem,
  PracticeCountryDataAttributes,
} from '@/types/generated/strapi.schemas';
import { useGetSubinterventions } from '@/types/generated/subintervention';

export type PracticesProperties = {
  id: number | undefined;
  title: string | undefined;
  countryLat: number;
  countryLong: number;
  countryName: string;
};

type Practice = {
  id: number | undefined;
};

type PracticeMapResponse = {
  features: PointFeatureWithPracticeProperties[];
  isFetching: boolean;
  isFetched: boolean;
  isPlaceholderData: boolean;
  isError: boolean;
};

type GroupedPractices = {
  [key: string]: PracticesProperties[];
};

const getQueryFilters = (filters: PracticesFilters) => {
  const generalFilters =
    typeof filters.search !== 'undefined' && filters.search.length > 0
      ? [
          {
            $or: [
              {
                title: {
                  $containsi: filters.search,
                },
              },
              {
                short_description: {
                  $containsi: filters.search,
                },
              },
              {
                detailed_description: {
                  $containsi: filters.search,
                },
              },
            ],
          },
        ]
      : [];
  const practiceFilters = [
    ...(filters.country.length > 0
      ? [
          {
            $or: filters.country.map((id) => ({
              country: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.landUseType
      ? [
          {
            land_use_types: {
              id: {
                $eq: filters.landUseType,
              },
            },
          },
        ]
      : []),
  ];

  return {
    $and: [...generalFilters, ...practiceFilters],
  };
};

export const usePractices = ({
  size = 20,
  filters,
}: {
  size?: number;
  filters: PracticesFilters;
}) => {
  const queryFilters = getQueryFilters(filters);

  const getNextPageParam = (lastPage: PracticeListResponse) => {
    const page = lastPage.meta?.pagination?.page ?? 1;
    const pageSize = size;
    const total = lastPage.meta?.pagination?.total ?? Infinity;

    return page * pageSize < total ? page + 1 : undefined;
  };

  const {
    data,
    isFetching,
    isFetched,
    isPlaceholderData,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useGetPracticesInfinite(
    {
      populate: '*',
      'pagination[pageSize]': size,
      sort: 'title:asc',
      filters: queryFilters,
    },
    {
      query: {
        queryKey: ['practice', filters],
        keepPreviousData: true,
        getNextPageParam,
      },
    },
  );

  return {
    data:
      data?.pages
        .map((page) => page.data ?? [])
        .reduce((res, practices) => [...res, ...practices], []) ?? [],
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isFetched,
    isPlaceholderData,
    isError,
  };
};

export type PointFeatureWithPracticeProperties = PointFeature<{
  countryName: string;
  practices: PracticesProperties[];
}>;

type Data = PracticeListResponse | PracticeResponse | undefined;

// Get country data from the practice
export const getCountryData = (d: PracticeListResponseDataItem) =>
  (d as PracticeListResponseDataItem)?.attributes?.country?.data?.attributes;

// Get only important data for the map
export const getParsedData: (
  d: PracticeListResponseDataItem,
  countryD: PracticeCountryDataAttributes,
) => PracticesProperties = (d, countryD) => ({
  id: d.id,
  title: d.attributes?.title,
  countryName: countryD?.name || '',
  countryLat: countryD?.lat || 0,
  countryLong: countryD?.long || 0,
});

// Parse data for each array
export const parseData = (data: Data): PracticesProperties[] => {
  if (!data?.data) return [];
  return (Array.isArray(data.data) ? data.data : [data.data])
    ?.map((d) => {
      const countryData = getCountryData(d);
      if (!countryData) return null;
      return getParsedData(d, countryData);
    })
    .filter((d: PracticesProperties | null): d is PracticesProperties => d !== null);
};

const useGetPracticesData = (filters: PracticesFilters) => {
  const queryFilters = getQueryFilters(filters);

  const {
    data: practicesData,
    isFetching: practicesIsFetching,
    isFetched: practicesIsFetched,
    isPlaceholderData: practicesIsPlaceholderData,
    isError: practicesIsError,
  } = useGetPractices(
    {
      populate: 'country',
      'pagination[pageSize]': 9999,
      filters: queryFilters,
    },
    {
      query: {
        queryKey: ['map-practices', filters],
        keepPreviousData: true,
      },
    },
  );

  return {
    practicesData: parseData(practicesData),
    isFetching: practicesIsFetching,
    isFetched: practicesIsFetched,
    isPlaceholderData: practicesIsPlaceholderData,
    isError: practicesIsError,
  };
};

const useGetPractice = ({ id }: Practice) => {
  const {
    data: practicesData,
    isFetching: networkIsFetching,
    isFetched: networkIsFetched,
    isPlaceholderData: networkIsPlaceholderData,
    isError: networkIsError,
  } = useGetPracticesId(
    id as number,
    {
      populate: 'country',
    },
    { query: { keepPreviousData: true } },
  );

  return {
    practicesData: parseData(practicesData),
    isFetching: networkIsFetching,
    isFetched: networkIsFetched,
    isPlaceholderData: networkIsPlaceholderData,
    isError: networkIsError,
  };
};

const getMapPractices = ({
  practicesData,
  isFetching,
  isFetched,
  isPlaceholderData,
  isError,
}: ReturnType<typeof useGetPracticesData>) => {
  const groupedPractices: GroupedPractices = practicesData.reduce(
    (acc: GroupedPractices, practice) => {
      const { countryName } = practice;

      if (typeof countryName === 'undefined') {
        return acc;
      }

      if (!acc[countryName]) {
        acc[countryName] = [];
      }

      acc[countryName].push(practice);

      return acc;
    },
    {},
  );

  const features: PointFeatureWithPracticeProperties[] = groupedPractices
    ? Object.entries(groupedPractices)
        .filter(([, practices]) => practices && practices.length > 0)
        .map(([countryName, practices]) => {
          if (!practices || (practices.length === 0 && typeof practices === 'undefined')) {
            return null;
          }
          return {
            type: 'Feature',
            properties: {
              countryName,
              practices,
            },
            geometry: {
              type: 'Point',
              coordinates: [practices[0]?.countryLong, practices[0]?.countryLat],
            },
          };
        })
        .filter((feature): feature is PointFeatureWithPracticeProperties => feature !== null)
    : [];

  return {
    features,
    isFetching,
    isFetched,
    isError,
    isPlaceholderData,
  };
};

export const useMapPractices = ({ filters }: { filters: PracticesFilters }): PracticeMapResponse =>
  getMapPractices(useGetPracticesData(filters));

export const useMapPractice = (practice: Practice): PracticeMapResponse =>
  getMapPractices(useGetPractice(practice));

export const usePracticesFiltersOptions = (): Record<
  keyof PracticesDropdownFilters,
  { label: string; value: number | string }[]
> => {
  const { data: countryData } = useGetCountries(
    {
      fields: ['name'],
      sort: 'name',
      'pagination[pageSize]': 9999,
    },
    {
      query: {
        queryKey: ['countries'],
      },
    },
  );
  const { data: landUseTypeData } = useGetLandUseTypes(
    {
      fields: ['name'],
    },
    {
      query: {
        queryKey: ['land-use-types'],
      },
    },
  );
  const { data: practiceInterventionData } = useGetPracticeInterventions(
    {
      fields: 'name',
    },
    {
      query: {
        queryKey: ['practice-interventions'],
      },
    },
  );
  const { data: subInterventionData } = useGetSubinterventions(
    {
      fields: 'name',
    },
    {
      query: {
        queryKey: ['sub-interventions'],
      },
    },
  );
  const country = useMemo(
    () =>
      countryData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          countryData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [countryData],
  );

  const landUseType = useMemo(
    () =>
      landUseTypeData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          landUseTypeData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [landUseTypeData],
  );

  const mainIntervention = useMemo(
    () =>
      practiceInterventionData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          practiceInterventionData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [practiceInterventionData],
  );
  const subIntervention = useMemo(
    () =>
      subInterventionData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          subInterventionData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [subInterventionData],
  );

  return {
    country,
    landUseType,
    mainIntervention,
    subIntervention,
  };
};

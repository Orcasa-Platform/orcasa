import { useMemo } from 'react';

import { PointFeature } from 'supercluster';

import { PracticesDropdownFilters, PracticesFilters } from '@/store/practices';

import { useGetCountries } from '@/types/generated/country';
import { useGetLandUseTypes } from '@/types/generated/land-use-type';
import {
  useGetPractices,
  useGetPracticesId,
  useGetPracticesInfinite,
} from '@/types/generated/practice';
import {
  PracticeCountriesDataItem,
  PracticeCountriesDataItemAttributes,
  PracticeListResponse,
  PracticeListResponseDataItem,
  PracticeResponse,
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
    ...(filters.sourceName.length > 0
      ? [
          {
            $or: filters.sourceName.map((id) => ({
              source_name: {
                $eq: id,
              },
            })),
          },
        ]
      : []),
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
    ...(filters.year.length > 0
      ? [
          {
            $or: filters.year.map((value) => {
              return {
                $and: [
                  {
                    publication_date: {
                      $lte: `${value}-12-31`,
                    },
                  },
                  {
                    publication_date: {
                      $gte: `${value}-01-01`,
                    },
                  },
                ],
              };
            }),
          },
        ]
      : []),
    // Main intervention is selected
    ...(filters.mainIntervention
      ? [{ practice_intervention: { $eq: filters.mainIntervention } }]
      : []),
    ...(filters.mainIntervention === 'Management' && filters.subInterventions
      ? [
          {
            $or: filters.subInterventions.map((id) => ({
              subinterventions: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.mainIntervention === 'Land Use Change' && filters.priorLandUseTypes
      ? [
          {
            $or: filters.priorLandUseTypes.map((id) => ({
              land_use_priors: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
    ...(filters.mainIntervention && filters.landUseTypes
      ? [
          {
            $or: filters.landUseTypes.map((id) => ({
              land_use_types: {
                id: {
                  $eq: id,
                },
              },
            })),
          },
        ]
      : []),
    // Main intervention is not selected:
    // We have to select all practices that have the selected land use types as land use types or prior land use types
    // and also prior land use types in the case of Land Use Change Management
    ...(!filters.mainIntervention
      ? [
          {
            $or: [
              {
                $and: [
                  {
                    practice_intervention: {
                      $eq: 'Management',
                    },
                  },
                  {
                    $or: filters.landUseTypes?.map((id) => ({
                      land_use_types: {
                        id: {
                          $eq: id,
                        },
                      },
                    })),
                  },
                ],
              },
              {
                $and: [
                  {
                    practice_intervention: {
                      $eq: 'Land Use Change',
                    },
                  },
                  {
                    $or: filters.landUseTypes?.map((id) => ({
                      land_use_priors: {
                        id: {
                          $eq: id,
                        },
                      },
                    })),
                  },
                ],
              },
              {
                $and: [
                  {
                    practice_intervention: {
                      $eq: 'Land Use Change',
                    },
                  },
                  {
                    $or: filters.landUseTypes?.map((id) => ({
                      land_use_types: {
                        id: {
                          $eq: id,
                        },
                      },
                    })),
                  },
                ],
              },
            ],
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

export const usePracticesCount = (filters: PracticesFilters) => {
  const queryFilters = getQueryFilters(filters);

  const { data } = useGetPractices(
    {
      fields: ['id'],
      'pagination[pageSize]': 1,
      filters: queryFilters,
    },
    {
      query: {
        queryKey: ['practice', 'count', filters],
        keepPreviousData: true,
      },
    },
  );

  return data?.meta?.pagination?.total ?? 0;
};

export type PointFeatureWithPracticeProperties = PointFeature<{
  countryName: string;
  practices: PracticesProperties[];
}>;

type Data = PracticeListResponse | PracticeResponse | undefined;

// Get countries data from the practice
export const getCountriesData = (d: PracticeListResponseDataItem) =>
  (d as PracticeListResponseDataItem)?.attributes?.countries?.data?.map(
    (country: PracticeCountriesDataItem) => country?.attributes,
  );

// Get only important data for the map
export const getParsedData: (
  d: PracticeListResponseDataItem,
  practiceCountries: Array<PracticeCountriesDataItemAttributes | undefined>,
) => Array<PracticesProperties> = (d, practiceCountries) => {
  return practiceCountries.map((practiceCountry) => ({
    id: d.id,
    title: d.attributes?.title,
    countryName: practiceCountry?.name || '',
    countryLat: practiceCountry?.lat || 0,
    countryLong: practiceCountry?.long || 0,
  }));
};

// Parse data for each array
export const parseData = (data: Data): PracticesProperties[] => {
  if (!data?.data) return [];
  return (Array.isArray(data.data) ? data.data : [data.data])
    ?.map((d: PracticeListResponseDataItem) => {
      const countryData: Array<PracticeCountriesDataItemAttributes | undefined> | undefined =
        getCountriesData(d);
      if (!countryData) return null;
      return getParsedData(d, countryData);
    })
    .flat()
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
      populate: 'countries',
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
      populate: '*',
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

export const usePracticesFiltersOptions = (
  filters: PracticesFilters,
): Record<keyof PracticesDropdownFilters, { label: string; value: number | string }[]> => {
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

  const { data: subInterventionData } = useGetSubinterventions(
    {
      fields: ['name'],
      filters: {
        $and: [
          {
            practices: {
              land_use_types: {
                id: {
                  $in: filters.landUseTypes,
                },
              },
              practice_intervention: {
                $eq: 'Management',
              },
            },
          },
        ],
      },
    },
    {
      query: {
        queryKey: [`sub-interventions-${filters.landUseTypes}`],
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

  const landUseTypes = useMemo(
    () =>
      landUseTypeData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          landUseTypeData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [landUseTypeData],
  );

  const mainIntervention = ['Management', 'Land Use Change'].map((d) => ({ label: d, value: d }));
  const sourceName = ['WOCAT', 'FAO'].map((d) => ({ label: d, value: d }));

  const subInterventions = useMemo(
    () =>
      subInterventionData?.data
        ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          subInterventionData.data.map((d) => ({ label: d.attributes!.name, value: d.id! }))
        : [],
    [subInterventionData],
  );

  return {
    country,
    // NOTE: 2010 is the hard-coded start year for the filter
    year: Array.from({ length: new Date().getFullYear() - 2010 + 1 }).map((_, index) => ({
      label: `${2010 + index}`,
      value: 2010 + index,
    })),

    sourceName,
    landUseTypes,
    priorLandUseTypes: landUseTypes,
    mainIntervention,
    subInterventions,
  };
};

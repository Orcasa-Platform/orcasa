module.exports = {
  orcasa: {
    output: {
      mode: 'tags',
      client: 'react-query',
      target: '../client/src/types/generated/strapi.ts',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        mutator: {
          path: '../client/src/services/api/index.ts',
          name: 'API',
        },
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: "'pagination[page]'",
          useMutation: true,
          options: {
            staleTime: 10000,
          },
          signal: true,
        },
        operations: {
          'get/datasets/{id}': {
            query: {
              useQuery: true,
              useInfinite: false,
              signal: true,
              options: {
                staleTime: 10000,
              },
            },
          },
          'get/dataset-groups/{id}': {
            query: {
              useQuery: true,
              useInfinite: false,
              signal: true,
              options: {
                staleTime: 10000,
              },
            },
          },
          'get/layers/{id}': {
            query: {
              useQuery: true,
              useInfinite: false,
              signal: true,
              options: {
                staleTime: 10000,
              },
            },
          },
        },
      },
    },
    input: {
      target:
        '../cms/dist/src/extensions/documentation/documentation/1.0.0/full_documentation.json',
      filters: {
        tags: ['Dataset', 'Dataset-group', 'Layer'],
      },
    },
  },
};

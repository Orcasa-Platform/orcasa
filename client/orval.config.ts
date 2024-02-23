/* eslint-disable import/no-anonymous-default-export */
export default {
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
          useInfinite: false,
          useMutation: true,
          signal: true,
        },
        operations: {
          'get/projects': {
            query: {
              useQuery: true,
              useInfinite: true,
              useInfiniteQueryParam: "'pagination[page]'",
              signal: true,
            },
          },
          'get/organizations': {
            query: {
              useQuery: true,
              useInfinite: true,
              useInfiniteQueryParam: "'pagination[page]'",
              signal: true,
            },
          },
          'get/organization-types': {
            query: {
              useQuery: true,
              signal: true,
            },
          },
          'post/organizations': {
            query: {
              useQuery: true,
            },
          },
          'get/practices': {
            query: {
              useQuery: true,
              useInfinite: true,
              useInfiniteQueryParam: "'pagination[page]'",
              signal: true,
            },
          },
        },
      },
    },
    input: {
      target:
        '../cms/dist/src/extensions/documentation/documentation/1.0.0/full_documentation.json',
      filters: {
        tags: [
          'Page',
          'Static-page',
          'Land-use-type',
          'Layer-group',
          'Layer',
          'Organization',
          'Project',
          'Country',
          'Organization-type',
          'Organization-theme',
          'Project-type',
          'Region',
          'Area-of-intervention',
          'Subintervention',
          'Sustainable-dev-goal',
          'Home-stat',
          'Practice',
          'Network-suggestion',
        ],
      },
    },
  },
};

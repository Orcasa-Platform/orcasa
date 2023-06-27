module.exports = {
  scaffold: {
    output: {
      mode: 'tags',
      client: 'react-query',
      target: './generated/strapi.ts',
      mock: false,
      clean: true,
      prettier: true,
      override: {
        query: {
          useQuery: true,
          useInfinite: true,
          useInfiniteQueryParam: 'nextId',
          useMutation: true,
          options: {
            staleTime: 10000,
          },
        },
      },
    },
    input: {
      target: '../cms/dist/src/extensions/documentation/documentation/1.0.0/full_documentation.json',
      filters: {
        tags: ['Dataset', 'Dataset-group', 'Deck-gl-layer', 'Mapbox-layer', 'Metadatum'],
      },
    }
  }
}

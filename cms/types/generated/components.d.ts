import type { Schema, Attribute } from '@strapi/strapi';

export interface DocumentationMetadata extends Schema.Component {
  collectionName: 'components_documentation_metadata';
  info: {
    displayName: 'Metadata';
    description: '';
  };
  attributes: {
    source: Attribute.String;
    source_url: Attribute.String;
    description: Attribute.Text;
    other_information: Attribute.RichText;
    short_description: Attribute.Text;
    long_title: Attribute.String;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'documentation.metadata': DocumentationMetadata;
    }
  }
}

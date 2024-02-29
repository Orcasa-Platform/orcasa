import { FormatProps } from '@/lib/utils/formats';

import { Practice } from '@/types/generated/strapi.schemas';

import { TypedPractice } from '../types';

import type { FieldType } from './field';

export const getPracticeFields = (practice: Practice): FieldType[] => {
  const {
    short_description: shortDescription,
    source_name: source,
    language,
    publication_date: publicationDate,
    project_fund: projectName,
    institution_funding: institutionName,
  } = practice as TypedPractice;

  const fields = [];

  if (publicationDate) {
    fields.push({
      label: 'Publication Date',
      value: publicationDate,
      formatId: 'formatDate' as FormatProps['id'],
    });
  }

  if (language) {
    fields.push({ label: 'Language', value: language.join(', ') });
  }

  if (source && source.length > 0) {
    fields.push({ label: 'Source', value: source, logo: true });
  }

  if (shortDescription && shortDescription.length > 0) {
    fields.push({ label: 'Description', value: shortDescription });
  }

  if (institutionName) {
    fields.push({ label: 'Institutions', value: institutionName });
  }

  if (projectName) {
    fields.push({ label: 'Initiative Name', value: projectName });
  }

  return fields;
};

export const getPracticeImplementationFields = (practice: Practice): FieldType[] => {
  const { country, implem_date: implementationDate } = practice;

  const fields = [];

  if (country) {
    fields.push({ label: 'Country', value: country?.data?.attributes?.name });
  }

  if (implementationDate) {
    fields.push({
      label: 'Implementation Date',
      value: implementationDate,
      formatId: 'formatDate' as FormatProps['id'],
    });
  }

  return fields;
};

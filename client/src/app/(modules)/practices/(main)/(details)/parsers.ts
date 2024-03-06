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
    projects,
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
    fields.push({ label: 'Language', value: language.map((l) => l.toUpperCase()).join(', ') });
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

  if (projects && projects?.data?.length) {
    fields.push({
      label: 'Project',
      value: projects?.data?.map((project) => project.attributes?.name),
      url: projects?.data?.map((project) => `/network/initiative/${project.id}`),
    });
  }

  return fields;
};

export const getPracticeImplementationFields = (practice: Practice): FieldType[] => {
  const { countries, implem_date: implementationDate } = practice;

  const fields = [];

  if (countries) {
    fields.push({
      label: `Countr${(countries?.data?.length ?? 0) > 1 ? 'ies' : 'y'}`,
      value: countries?.data?.map((country) => country?.attributes?.name).join(', '),
    });
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

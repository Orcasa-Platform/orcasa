import { FormatProps } from '@/lib/utils/formats';

import { Practice } from '@/types/generated/strapi.schemas';

import type { FieldType } from './field';

// Strapi doesn't allow the type to be an array, so we are temporarily asserting it here
interface TypedPractice extends Omit<Practice, 'language'> {
  language: string[] | undefined;
}

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
    //  TODO: Update this as it will be an iso array when the API is updated
    fields.push({ label: 'Language', value: language.sort((lang: string) => lang.length)[0] });
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
    fields.push({ label: 'Project Name', value: projectName });
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

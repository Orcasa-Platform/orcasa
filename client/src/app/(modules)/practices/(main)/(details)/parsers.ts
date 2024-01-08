// import { format } from '@/lib/utils/formats';

import { Practice } from '@/types/generated/strapi.schemas';

// const hasData = (field: Practice[keyof Practice]) => {
//   if (!field || field === '') return false;
//   if (typeof field === 'string') return true;
//   return typeof field !== 'undefined' && field?.data;
// };

export const getPracticeFields = (practice: Practice) => {
  const {
    short_description: shortDescription,
    source_name: source,
    // country, language
  } = practice;

  const fields = [];

  if (shortDescription && shortDescription.length > 0) {
    fields.push({ label: 'Description', value: shortDescription });
  }

  if (source && source.length > 0) {
    fields.push({ label: 'Source', value: source, logo: true });
  }

  // if (description && description.length > 0) {
  //   fields.push({ label: 'Description and outcomes', value: description, hasEllipsis: true });
  // }

  // if (country) {
  //   fields.push({ label: 'Country', value: country?.data?.attributes?.name });
  // }

  return fields;
};

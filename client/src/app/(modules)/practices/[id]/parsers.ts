import { FormatProps } from '@/lib/utils/formats';

import { Practice } from '@/types/generated/strapi.schemas';

import { TypedPractice } from '../(main)/types';

import type { FieldType } from './field';

export const getPracticeFields = (practice: Practice): FieldType[] => {
  const {
    source_name: source,
    language,
    publication_date: publicationDate,
    project_fund: projectName,
    institution_funding: institutionName,
    projects,
    organizations,
    practice_intervention: mainIntervention,
    land_use_types: landUseTypes,
    land_use_priors: landUsePriors,
  } = practice as TypedPractice;

  const fields = [];

  if (publicationDate) {
    fields.push({
      label: 'Publication date',
      value: publicationDate,
      formatId: 'formatDate' as FormatProps['id'],
    });
  }

  if (language) {
    fields.push({ label: 'Language', value: language.map((l) => l.toUpperCase()).join(', ') });
  }

  if (source && source.length > 0) {
    fields.push({ label: 'Source', value: source });
  }

  if (mainIntervention) {
    fields.push({ label: 'Main intervention', value: mainIntervention });
  }

  if (landUsePriors && landUsePriors?.data?.length) {
    fields.push({
      label: `Land use type${landUsePriors?.data?.length > 1 ? 's' : ''}`,
      value: landUsePriors?.data?.map((landUsePrior) => landUsePrior.attributes?.name).join(', '),
    });
  }

  if (landUseTypes && landUseTypes?.data?.length) {
    fields.push({
      label: `New land use type${landUseTypes?.data?.length > 1 ? 's' : ''}`,
      value: landUseTypes?.data?.map((landUseType) => landUseType.attributes?.name).join(', '),
    });
  }

  if (organizations && organizations?.data?.length) {
    fields.push({
      label: `Organisation${organizations?.data?.length > 1 ? 's' : ''}`,
      value: organizations?.data?.map((organization) => organization.attributes?.name),
      url: organizations?.data?.map((organization) => `/network/organization/${organization.id}`),
    });
  } else if (institutionName) {
    fields.push({ label: 'Organisation(s)', value: institutionName });
  }

  if (projects && projects?.data?.length) {
    fields.push({
      label: `Initiative${projects?.data?.length > 1 ? 's' : ''}`,
      value: projects?.data?.map((project) => project.attributes?.name),
      url: projects?.data?.map((project) => `/network/initiative/${project.id}`),
    });
  } else if (projectName) {
    fields.push({ label: 'Initiative', value: projectName });
  }

  return fields;
};

export const getPracticeImplementationFields = (practice: Practice): FieldType[] => {
  const {
    countries,
    implem_date: implementationDate,
    implem_decade: implementationDecade,
  } = practice;

  const fields = [];

  if (countries && (countries?.data?.length ?? 0) > 0) {
    fields.push({
      label: `Countr${(countries?.data?.length ?? 0) > 1 ? 'ies' : 'y'}`,
      value: countries?.data?.map((country) => country?.attributes?.name).join(', '),
    });
  }

  if (implementationDate) {
    fields.push({
      label: 'Implementation date',
      value: implementationDate,
      formatId: 'formatDate' as FormatProps['id'],
    });
  } else if (implementationDecade) {
    fields.push({
      label: 'Implementation decade',
      value: implementationDecade,
      description: 'Effective from the date of publication',
    });
  }

  return fields;
};

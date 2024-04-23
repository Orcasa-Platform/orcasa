import { format } from '@/lib/utils/formats';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import Field from './field';

const hasData = (field: Project[keyof Project]) => {
  if (!field || field === '') return false;
  if (typeof field === 'string') return true;
  return typeof field !== 'undefined' && field?.data;
};

export const getProjectFields = (
  project: Project & { isWorldwide: boolean },
  desiredFields?: (keyof Project)[],
) => {
  let fields: Partial<Project> = {
    short_description: project.short_description,
    description: project.description,
    start_date: project.start_date,
    country_of_coordination: project.country_of_coordination,
    project_coordinator_email: project.project_coordinator_email,
    project_type: project.project_type,
    region_of_interventions: project.region_of_interventions,
    country_of_interventions: project.country_of_interventions,
    main_area_of_intervention: project.main_area_of_intervention,
    sustainable_development_goals: project.sustainable_development_goals,
    lead_partner: project.lead_partner,
    land_use_types: project.land_use_types,
    practices: project.practices,
  };

  if (desiredFields) {
    fields = Object.fromEntries(
      Object.entries(fields).filter(([key]) => desiredFields.includes(key as keyof Project)),
    );
  }

  const res: Field[] = [];

  if (fields.short_description && fields.short_description.length > 0) {
    res.push({ label: 'Short description', value: fields.short_description });
  }

  if (fields.description && fields.description.length > 0) {
    res.push({
      label: 'Description and outcomes',
      value: fields.description,
      hasEllipsis: true,
      markup: true,
    });
  }

  if (fields.start_date) {
    const formatDate = (date: string) =>
      format({
        id: 'formatDate',
        value: date,
      });

    res.push({
      label: 'Dates',
      value: `${formatDate(fields.start_date)}${
        project.end_date ? ` - ${formatDate(project.end_date)}` : ''
      }`,
    });
  }

  if (hasData(fields.country_of_coordination)) {
    res.push({
      label: 'Country of coordination',
      value: fields.country_of_coordination?.data?.attributes?.name,
    });
  }

  if (hasData(fields.lead_partner)) {
    res.push({
      label: 'Coordinator',
      value: fields.lead_partner?.data?.attributes?.name,
      url: `/network/organization/${fields.lead_partner?.data?.id}`,
    });
  }

  if (
    hasData(fields.project_coordinator_email) ||
    ('project_coordinator_email' in fields && hasData(project.project_coordinator_website))
  ) {
    const makeGlobalLink = (link: string) =>
      link.startsWith('http://') || link.startsWith('https://')
        ? link
        : `https://${project.project_coordinator_website}`;

    res.push({
      label: 'Contact',
      value: fields.project_coordinator_email ?? project.project_coordinator_website,
      url: hasData(fields.project_coordinator_email)
        ? `mailto:${fields.project_coordinator_email}`
        : project.project_coordinator_website
        ? makeGlobalLink(project.project_coordinator_website)
        : undefined,

      external: true,
    });
  }

  if (hasData(fields.project_type)) {
    res.push({
      label: 'Initiative type',
      value: fields.project_type?.data?.attributes?.name,
      description: fields.project_type?.data?.attributes?.description,
    });
  }

  if (hasData(fields.practices) && fields.practices?.data?.length) {
    res.push({
      label: `Practice${fields.practices?.data?.length > 1 ? 's' : ''}`,
      value: fields.practices?.data?.map((practice) => practice.attributes?.title),
      url: fields.practices?.data?.map((practice) => `/practices/${practice.id}`),
    });
  }

  if (hasData(fields.land_use_types) && fields.land_use_types?.data?.length) {
    res.push({
      label: `Land use type${fields.land_use_types?.data?.length > 1 ? 's' : ''}`,
      value: fields.land_use_types?.data?.map((lut) => lut.attributes?.name).join(', '),
    });
  }

  if (hasData(fields.region_of_interventions) && fields.region_of_interventions?.data?.length) {
    res.push({
      label: `Region${
        project.isWorldwide || fields.region_of_interventions?.data?.length === 1 ? '' : 's'
      } of intervention`,
      value: project.isWorldwide
        ? 'Worldwide'
        : fields.region_of_interventions?.data?.map((c) => c.attributes?.name).join(', '),
    });
  }

  if (hasData(fields.country_of_interventions) && fields.country_of_interventions?.data?.length) {
    res.push({
      label: `Countr${
        fields.country_of_interventions?.data?.length > 1 ? 'ies' : 'y'
      } of intervention`,
      value: fields.country_of_interventions?.data?.map((c) => c.attributes?.name).join(', '),
    });
  }

  if (hasData(fields.main_area_of_intervention)) {
    const mainAreaName =
      fields.main_area_of_intervention?.data?.attributes?.name === 'Other (to be specified)'
        ? project.main_area_of_intervention_other
        : fields.main_area_of_intervention?.data?.attributes?.name;

    const mainAreaOfInterventions = [mainAreaName];
    const secondaryAreaName = project.secondary_area_of_intervention?.data?.attributes?.name;
    if (secondaryAreaName && secondaryAreaName !== 'Other (to be specified)') {
      mainAreaOfInterventions.push(secondaryAreaName);
    }

    const thirdAreaName = project.third_area_of_intervention?.data?.attributes?.name;
    if (thirdAreaName && thirdAreaName !== 'Other (to be specified)') {
      mainAreaOfInterventions.push(thirdAreaName);
    }

    res.push({
      label: `Main area${mainAreaOfInterventions.length > 1 ? 's' : ''} of intervention`,
      value: mainAreaOfInterventions.join(', '),
    });
  }

  if (
    hasData(fields.sustainable_development_goals) &&
    fields.sustainable_development_goals?.data?.length
  ) {
    res.push({
      label: `Sustainable development goal${
        fields.sustainable_development_goals?.data?.length > 1 ? 's' : ''
      }`,
      value: fields.sustainable_development_goals?.data
        ?.map((sdg) => sdg.attributes?.name)
        .join(', '),
    });
  }

  return res;
};

export const getOrganizationFields = (
  organization: Organization,
  desiredFields?: (keyof Organization)[],
) => {
  let fields: Partial<Organization> = {
    short_description: organization.short_description,
    description: organization.description,
    country: organization.country,
    main_organization_theme: organization.main_organization_theme,
    organization_type: organization.organization_type,
    practices: organization.practices,
  };

  if (desiredFields) {
    fields = Object.fromEntries(
      Object.entries(fields).filter(([key]) => desiredFields.includes(key as keyof Organization)),
    );
  }

  const res: Field[] = [];

  if (fields.short_description && fields.short_description.length > 0) {
    res.push({ label: 'Short description', value: fields.short_description });
  }

  if (fields.description && fields.description.length > 0) {
    res.push({
      label: 'Description and outcomes',
      value: fields.description,
      hasEllipsis: true,
      markup: true,
    });
  }

  if (fields.country) {
    res.push({ label: 'Country', value: fields.country?.data?.attributes?.name });
  }

  if (fields.main_organization_theme) {
    const thematics = `${fields.main_organization_theme?.data?.attributes?.name}${
      organization.secondary_organization_theme?.data?.attributes?.name
        ? `, ${organization.secondary_organization_theme?.data?.attributes?.name}`
        : ''
    } `;
    res.push({ label: 'Thematic', value: thematics });
  }

  if (hasData(fields.practices) && fields.practices?.data?.length) {
    res.push({
      label: `Practice${fields.practices?.data?.length > 1 ? 's' : ''}`,
      value: fields.practices?.data?.map((practice) => practice.attributes?.title),
      url: fields.practices?.data?.map((practice) => `/practices/${practice.id}`),
    });
  }

  if (fields.organization_type) {
    res.push({
      label: 'Type of organisation',
      value: organization.organization_type_other
        ? `Other (${organization.organization_type_other})`
        : fields.organization_type?.data?.attributes?.name,
    });
  }

  return res;
};

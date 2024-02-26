import { format } from '@/lib/utils/formats';

import { Organization, Project } from '@/types/generated/strapi.schemas';

const hasData = (field: Project[keyof Project]) => {
  if (!field || field === '') return false;
  if (typeof field === 'string') return true;
  return typeof field !== 'undefined' && field?.data;
};

export const getProjectFields = (project: Project & { isWorldwide: boolean }) => {
  const {
    short_description: shortDescription,
    description,
    start_date: startDate,
    end_date: endDate,
    country_of_coordination: countryOfCoordination,
    project_coordinator_name: projectCoordinatorName,
    project_coordinator_email: projectCoordinatorEmail,
    second_project_coordinator_name: secondProjectCoordinatorName,
    second_project_coordinator_email: secondProjectCoordinatorEmail,
    project_type: projectType,
    region_of_interventions: regionOfInterventions,
    country_of_interventions: countryOfInterventions,
    main_area_of_intervention: mainAreaOfIntervention,
    secondary_area_of_intervention: secondaryAreaOfIntervention,
    third_area_of_intervention: thirdAreaOfIntervention,
    main_area_of_intervention_other: mainAreaOfInterventionOther,
    sustainable_development_goals: sustainableDevelopmentGoals,
    lead_partner: leadPartner,
    isWorldwide,
    land_use_types: landUseTypes,
  } = project;

  const fields = [];

  if (shortDescription && shortDescription.length > 0) {
    fields.push({ label: 'Short description', value: shortDescription });
  }

  if (description && description.length > 0) {
    fields.push({
      label: 'Description and outcomes',
      value: description,
      hasEllipsis: true,
      rawHTML: true,
    });
  }

  if (startDate) {
    const formatDate = (date: string) =>
      format({
        id: 'formatDate',
        value: date,
      });

    fields.push({
      label: 'Dates',
      value: `${formatDate(startDate)}${endDate ? ` - ${formatDate(endDate)}` : ''}`,
    });
  }

  if (hasData(countryOfCoordination)) {
    fields.push({
      label: 'Country of coordination',
      value: countryOfCoordination?.data?.attributes?.name,
    });
  }

  if (hasData(leadPartner)) {
    fields.push({
      label: 'Coordinator',
      value: leadPartner?.data?.attributes?.name,
      url: `/network/organization/${leadPartner?.data?.id}`,
    });
  }

  if (hasData(projectCoordinatorName)) {
    if (hasData(secondProjectCoordinatorName)) {
      fields.push({
        label: 'Initiative managers',
        value: [projectCoordinatorName, secondProjectCoordinatorName],
        url: [`mailto:${projectCoordinatorEmail}`, `mailto:${secondProjectCoordinatorEmail}`],
        external: true,
      });
    } else {
      fields.push({
        label: 'Initiative manager',
        value: projectCoordinatorName,
        url: `mailto:${projectCoordinatorEmail}`,
        external: true,
      });
    }
  }

  if (hasData(projectType)) {
    fields.push({
      label: 'Initiative type',
      value: projectType?.data?.attributes?.name,
    });
  }

  if (hasData(landUseTypes) && landUseTypes?.data?.length) {
    fields.push({
      label: `Land use type${landUseTypes?.data?.length > 1 ? 's' : ''}`,
      value: landUseTypes?.data?.map((lut) => lut.attributes?.name).join(', '),
    });
  }

  if (hasData(regionOfInterventions) && regionOfInterventions?.data?.length) {
    fields.push({
      label: `Region${
        isWorldwide || regionOfInterventions?.data?.length === 1 ? '' : 's'
      } of intervention`,
      value: isWorldwide
        ? 'Worldwide'
        : regionOfInterventions?.data?.map((c) => c.attributes?.name).join(', '),
    });
  }

  if (hasData(countryOfInterventions) && countryOfInterventions?.data?.length) {
    fields.push({
      label: `Countr${countryOfInterventions?.data?.length > 1 ? 'ies' : 'y'} of intervention`,
      value: countryOfInterventions?.data?.map((c) => c.attributes?.name).join(', '),
    });
  }

  if (hasData(mainAreaOfIntervention)) {
    const mainAreaName =
      mainAreaOfIntervention?.data?.attributes?.name === 'Other (to be specified)'
        ? mainAreaOfInterventionOther
        : mainAreaOfIntervention?.data?.attributes?.name;

    const mainAreaOfInterventions = [mainAreaName];
    const secondaryAreaName = secondaryAreaOfIntervention?.data?.attributes?.name;
    if (secondaryAreaName && secondaryAreaName !== 'Other (to be specified)') {
      mainAreaOfInterventions.push(secondaryAreaName);
    }

    const thirdAreaName = thirdAreaOfIntervention?.data?.attributes?.name;
    if (thirdAreaName && thirdAreaName !== 'Other (to be specified)') {
      mainAreaOfInterventions.push(thirdAreaName);
    }

    fields.push({
      label: `Main area${mainAreaOfInterventions.length > 1 ? 's' : ''} of intervention`,
      value: mainAreaOfInterventions.join(', '),
    });
  }

  if (hasData(sustainableDevelopmentGoals) && sustainableDevelopmentGoals?.data?.length) {
    fields.push({
      label: `Sustainable Development Goal${
        sustainableDevelopmentGoals?.data?.length > 1 ? 's' : ''
      }`,
      value: sustainableDevelopmentGoals?.data?.map((sdg) => sdg.attributes?.name).join(', '),
    });
  }

  return fields;
};

export const getOrganizationFields = (organization: Organization) => {
  const {
    short_description: shortDescription,
    description,
    country,
    main_organization_theme: thematic,
    secondary_organization_theme: secondaryThematic,
    organization_type: organizationType,
    organization_type_other: otherOrganizationType,
  } = organization;

  const fields = [];

  if (shortDescription && shortDescription.length > 0) {
    fields.push({ label: 'Short description', value: shortDescription });
  }

  if (description && description.length > 0) {
    fields.push({ label: 'Description and outcomes', value: description, hasEllipsis: true });
  }

  if (country) {
    fields.push({ label: 'Country', value: country?.data?.attributes?.name });
  }

  if (thematic) {
    const thematics = `${thematic?.data?.attributes?.name}${
      secondaryThematic?.data?.attributes?.name
        ? `, ${secondaryThematic?.data?.attributes?.name}`
        : ''
    } `;
    fields.push({ label: 'Thematic', value: thematics });
  }

  if (organizationType) {
    fields.push({
      label: 'Type of organisation',
      value: otherOrganizationType
        ? `Other (${otherOrganizationType})`
        : organizationType?.data?.attributes?.name,
    });
  }

  return fields;
};

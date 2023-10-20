import { format } from '@/lib/utils/formats';

import { Organization, Project } from '@/types/generated/strapi.schemas';

const hasData = (field: Project[keyof Project]) => {
  if (!field || field === '') return false;
  if (typeof field === 'string') return true;
  return typeof field !== 'undefined' && field?.data;
};

export const getProjectFields = (project: Project) => {
  const {
    description,
    start_date: startDate,
    end_date: endDate,
    country_of_coordination: countryOfCoordination,
    project_coordinator_name: projectCoordinatorName,
    project_coordinator_email: projectCoordinatorEmail,
    second_project_coordinator_name: secondProjectCoordinatorName,
    second_project_coordinator_email: secondProjectCoordinatorEmail,
    project_type: projectType,
    country_of_interventions: countryOfInterventions,
    main_area_of_intervention: mainAreaOfIntervention,
    secondary_area_of_intervention: secondaryAreaOfIntervention,
    third_area_of_intervention: thirdAreaOfIntervention,
    main_area_of_intervention_other: mainAreaOfInterventionOther,
    sustainable_development_goal: sustainableDevelopmentGoal,
  } = project;

  const fields = [];

  if (typeof description !== 'undefined' && description.length > 0) {
    fields.push({ label: 'Description', value: description });
  }

  if (typeof startDate !== 'undefined') {
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

  if (hasData(projectCoordinatorName)) {
    if (hasData(secondProjectCoordinatorName)) {
      fields.push({
        label: 'Project coordinators',
        value: [projectCoordinatorName, secondProjectCoordinatorName],
        url: [`mailto:${projectCoordinatorEmail}`, `mailto:${secondProjectCoordinatorEmail}`],
      });
    } else {
      fields.push({
        label: 'Project coordinator',
        value: projectCoordinatorName,
        url: `mailto:${projectCoordinatorEmail}`,
      });
    }
  }

  if (hasData(projectType)) {
    fields.push({
      label: 'Project type',
      value: projectType?.data?.attributes?.name,
    });
  }

  if (hasData(countryOfInterventions) && countryOfInterventions?.data?.length) {
    fields.push({
      label: 'Country of interventions',
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
      label: 'Main areas of interventions',
      value: mainAreaOfInterventions.join(', '),
    });
  }

  if (hasData(sustainableDevelopmentGoal)) {
    fields.push({
      label: 'Sustainable Development Goal',
      value: sustainableDevelopmentGoal?.data?.attributes?.name,
    });
  }

  return fields;
};

export const getOrganizationFields = (organization: Organization) => {
  const {
    description,
    country,
    main_organization_theme: thematic,
    secondary_organization_theme: secondaryThematic,
    organization_type: organizationType,
  } = organization;
  const fields = [];

  if (typeof description !== 'undefined' && description.length > 0) {
    fields.push({ label: 'Description', value: description });
  }

  if (typeof country !== 'undefined') {
    fields.push({ label: 'Country', value: country?.data?.attributes?.name });
  }

  if (typeof thematic !== 'undefined') {
    const thematics = `${thematic?.data?.attributes?.name}${
      secondaryThematic?.data?.attributes?.name
        ? `, ${secondaryThematic?.data?.attributes?.name}`
        : ''
    } `;
    fields.push({ label: 'Thematic', value: thematics });
  }

  if (typeof organizationType !== 'undefined') {
    fields.push({
      label: 'Type of organisation',
      value: organizationType?.data?.attributes?.name,
    });
  }

  return fields;
};

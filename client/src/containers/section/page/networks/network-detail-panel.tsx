'use client';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';

import { cn } from '@/lib/classnames';
import { format } from '@/lib/utils/formats';

import { Organization, Project } from '@/types/generated/strapi.schemas';

import { NetworkResponse } from '@/hooks/networks';

import type { OpenDetails } from '@/containers/section/page/pages/network';

import { SlidingButton, Button } from '@/components/ui/button';
type ProjectWithType = { type: 'project'; attributes: Project; id: number };
type OrganizationWithType = { type: 'organization'; attributes: Organization; id: number };

const isProject = (
  dataWithType: Data & { type: Type },
): dataWithType is ProjectWithType & { type: Type } => dataWithType.type === 'project';

const isOrganization = (
  dataWithType: Data & { type: Type },
): dataWithType is OrganizationWithType & { type: Type } => dataWithType.type === 'organization';

type Data = NetworkResponse['networks'][0] | null;
type Type = 'project' | 'organization' | undefined;
type Field = {
  label: string;
  value: string | undefined;
  url?: string;
};

const getOrganizationFields = (dataWithType: OrganizationWithType) => {
  const {
    country,
    main_organization_theme: thematic,
    secondary_organization_theme: secondaryThematic,
    organization_type: organizationType,
  } = dataWithType.attributes || {};
  const fields = [];
  if (typeof country !== 'undefined') {
    fields.push({ label: 'Country', value: country?.data?.attributes?.name });
  }
  if (typeof thematic !== 'undefined') {
    const thematics = `${thematic?.data?.attributes?.name}${secondaryThematic?.data?.attributes?.name
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

const getProjectFields = (dataWithType: ProjectWithType) => {
  const {
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
    sustainable_development_goal: sustainableDevelopmentGoal,
  } = dataWithType.attributes || {};

  const fields = [];
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

  if (typeof countryOfCoordination !== 'undefined') {
    fields.push({
      label: 'Country of coordination',
      value: countryOfCoordination?.data?.attributes?.name,
    });
  }

  if (typeof projectCoordinatorName !== 'undefined') {
    fields.push({
      label: 'Project coordinator',
      value: projectCoordinatorName,
      url: `mailto:${projectCoordinatorEmail}`,
    });
  }

  if (typeof secondProjectCoordinatorName !== 'undefined') {
    fields.push({
      label: 'Second project coordinator',
      value: secondProjectCoordinatorName,
      url: `mailto:${secondProjectCoordinatorEmail}`,
    });
  }
  if (typeof projectType !== 'undefined') {
    fields.push({
      label: 'Project type',
      value: projectType?.data?.attributes?.name,
    });
  }
  if (typeof countryOfInterventions !== 'undefined') {
    fields.push({
      label: 'Country of interventions',
      value: countryOfInterventions?.data?.map((c) => c.attributes?.name).join(', '),
    });
  }
  if (typeof mainAreaOfIntervention !== 'undefined') {
    fields.push({
      label: 'Main area of intervention',
      value: mainAreaOfIntervention?.data?.attributes?.name,
    });
  }
  if (typeof sustainableDevelopmentGoal !== 'undefined') {
    fields.push({
      label: 'Sustainable Development Goal',
      value: sustainableDevelopmentGoal?.data?.attributes?.name,
    });
  }
  return fields;
};

const Field = ({ label, value, url, type }: Field & { type: Type }) => {
  return (
    <div className="flex gap-6">
      <div
        className={cn('text-sm font-semibold', {
          'w-[224px] min-w-[224px]': type === 'project',
          'w-[144px] min-w-[144px]': type === 'organization',
        })}
      >
        {label}
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="text-sm text-red-400">
          {value}
        </a>
      ) : (
        <div className="text-sm">{value}</div>
      )}
    </div>
  );
};

export default function NetworkDetailPanel({
  data,
  type,
  setOpenDetails,
}: {
  data: Data;
  type: Type;
  setOpenDetails: (details: OpenDetails) => void;
}) {
  if (!data || !type) return null;
  const { attributes } = data || {};
  const { name, description } = attributes || {};
  let fields: Field[] = [{ label: 'Description', value: description }];
  const dataWithType = { ...data, type };
  let url;

  if (isProject(dataWithType)) {
    url = dataWithType.attributes?.website;
    fields = fields.concat(getProjectFields(dataWithType));
  }

  if (isOrganization(dataWithType)) {
    url = dataWithType.attributes?.url;
    fields = fields.concat(getOrganizationFields(dataWithType));
  }
  return (
    <div
      className={cn(
        'absolute inset-0 z-10 h-full w-full -translate-x-full overflow-y-auto bg-white p-12',
        {
          'translate-x-0': !!data,
          '-translate-x-full': !data,
        },
      )}
    >
      <SlidingButton
        onClick={() => {
          setOpenDetails(null);
        }}
        text="Back to Results"
        Icon={ArrowLeft}
      />
      <div className="mb-6 mt-10 text-[34px] leading-[50px]">{name}</div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} type={type} />
        ))}
      </div>
      <div className="mt-10 flex justify-end gap-4">
        <Button disabled asChild variant="secondary">
          <div>
            <Pencil className="mr-2 h-6 w-6" />
            Suggest changes
          </div>
        </Button>
        <Button asChild variant="secondary">
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-6 w-6" />
            Visit Website
          </a>
        </Button>
      </div>
    </div>
  );
}

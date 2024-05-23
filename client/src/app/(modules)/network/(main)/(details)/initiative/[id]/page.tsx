import { notFound } from 'next/navigation';

import { Metadata } from 'next';

import ExternalLink from '/public/images/external-link.svg';

import { getProjects, getProjectsId } from '@/types/generated/project';
import { getRegions } from '@/types/generated/region';

import NetworkDiagram from '@/components/network-diagram';
import { Button } from '@/components/ui/button';

import Field from '../../field';
import { getProjectFields } from '../../parsers';
import SuggestButton from '../../suggest-button';

interface ProjectDetailsProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProjectDetailsProps): Promise<Metadata> {
  const id = parseInt(params.id);
  const data = await getProjectsId(id);
  const project = data?.data?.attributes;

  if (!project || project.publication_status !== 'accepted') {
    return {};
  }

  return {
    title: `Impact4Soil - ${project?.name}`,
    description: project?.short_description,
  };
}

export default async function ProjectDetails({ params }: ProjectDetailsProps) {
  const id = parseInt(params.id);
  const data = await getProjects({
    filters: { id, publication_status: 'accepted' },
    populate: {
      lead_partner: { filters: { publication_status: 'accepted' }, fields: ['name', 'id'] },
      project_type: { fields: ['name', 'id', 'description'] },
      country_of_coordination: { fields: ['name', 'id'] },
      region_of_interventions: { fields: ['name', 'id'] },
      country_of_interventions: { fields: ['name', 'id'] },
      main_area_of_intervention: { fields: ['name', 'id'] },
      secondary_area_of_intervention: { fields: ['name', 'id'] },
      third_area_of_intervention: { fields: ['name', 'id'] },
      sustainable_development_goals: { fields: ['name', 'id'] },
      partners: { filters: { publication_status: 'accepted' }, fields: ['name', 'id'] },
      funders: { filters: { publication_status: 'accepted' }, fields: ['name', 'id'] },
      land_use_types: { fields: ['name', 'id'] },
      practices: { fields: ['title', 'id'] },
    },
  });
  const regionsMeta = await getRegions({
    fields: ['id'],
    'pagination[pageSize]': 1,
  });

  const regionsCount = regionsMeta?.meta?.pagination?.total ?? -1;
  const projectList = data?.data || [];
  const project = projectList[0]?.attributes;

  if (!project) {
    notFound();
  }

  const makeGlobalLink = (link: string) =>
    link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;

  const { name, short_description, website } = project;

  return (
    <>
      <h1 className="mb-6 mt-10 font-serif text-2xl leading-10 lg:text-3xl">{name}</h1>
      {!!short_description && (
        <p className="text-sm leading-7 text-gray-200">{short_description}</p>
      )}
      <div className="flex flex-col gap-4">
        {getProjectFields(
          {
            ...project,
            isWorldwide: regionsCount === project.region_of_interventions?.data?.length,
          },
          ['start_date', 'project_type', 'region_of_interventions'],
        ).map((field) => (
          <Field key={field.label} {...field} type="project" />
        ))}
      </div>
      <NetworkDiagram data={project} id={id} type="project" />
      <h2 className="font-serif text-xl">More details</h2>
      <div className="flex flex-col gap-4">
        {getProjectFields(
          {
            ...project,
            isWorldwide: regionsCount === project.region_of_interventions?.data?.length,
          },
          [
            'description',
            'country_of_coordination',
            'lead_partner',
            'project_coordinator_email',
            'country_of_interventions',
            'main_area_of_intervention',
            'practices',
            'land_use_types',
            'sustainable_development_goals',
          ],
        ).map((field) => (
          <Field key={field.label} {...field} type="project" />
        ))}
      </div>
      <div className="flex justify-end gap-4 border-t border-gray-600 pt-6">
        <SuggestButton data={project} label="initiative" />

        <Button asChild variant="outline-dark" size="sm" disabled={!website}>
          <a href={makeGlobalLink(website)} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Website
          </a>
        </Button>
      </div>
    </>
  );
}

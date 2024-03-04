import { notFound } from 'next/navigation';

import { ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

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

  const { name, website } = project;

  const fields: Field[] = getProjectFields({
    ...project,
    isWorldwide: regionsCount === project.region_of_interventions?.data?.length,
  });

  return (
    <>
      <div className="mb-6 mt-10 font-serif text-3.8xl leading-[50px]">{name}</div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} type="project" />
        ))}
      </div>
      <div className="mt-10 flex justify-end gap-4">
        <SuggestButton id={id} data={project} label="initiative" />

        <Button asChild variant="secondary" disabled={!website}>
          <a href={website} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-6 w-6" />
            Visit Website
          </a>
        </Button>
      </div>
      <NetworkDiagram data={project} id={id} type="project" />
    </>
  );
}

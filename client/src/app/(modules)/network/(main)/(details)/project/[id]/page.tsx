import { notFound } from 'next/navigation';

import { ExternalLink, Pencil } from 'lucide-react';
import { Metadata } from 'next';

import env from '@/env.mjs';

import { getProjects, getProjectsId } from '@/types/generated/project';

import NetworkDiagram from '@/components/network-diagram';
import { Button } from '@/components/ui/button';

import Field from '../../field';
import { getProjectFields } from '../../parsers';

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
      project_type: { fields: ['name', 'id'] },
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
    },
  });
  const projectList = data?.data || [];
  const project = projectList[0]?.attributes;

  if (!project) {
    notFound();
  }

  const { name, website } = project;

  const fields: Field[] = getProjectFields(project);

  return (
    <>
      <div className="mb-6 mt-10 font-serif text-3.8xl leading-[50px]">{name}</div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} type="project" />
        ))}
      </div>
      <div className="mt-10 flex justify-end gap-4">
        <Button variant="secondary" asChild>
          <a
            href={`mailto:${
              env.NEXT_PUBLIC_NETWORK_SUGGESTION_EMAIL_RECIPIENTS
            }?subject=${encodeURIComponent(
              `Impact4Soil - Network - Change suggestion for project "${project.name}", ID: ${id}`,
            )}&body=${encodeURIComponent(
              `Kindly provide comprehensive details below regarding the changes you'd like to suggest. Include your name, your affiliated organization, and an email address for potential contact. Thank you for assisting us in keeping the Soil Carbon Network up-to-date! Sincerely, The Impact4Soil Team.`,
            )}`}
          >
            <Pencil className="mr-2 h-6 w-6" />
            Suggest changes
          </a>
        </Button>
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

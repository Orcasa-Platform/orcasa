import { notFound } from 'next/navigation';

import { ExternalLink, Pencil } from 'lucide-react';
import { Metadata } from 'next';

import { getProjectsId } from '@/types/generated/project';

import NetworkDiagram from '@/components/network-diagram';
import { Button } from '@/components/ui/button';

import Field from '../../field';
import { getProjectFields } from '../../parsers';

interface ProjectDetailsProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProjectDetailsProps): Promise<Metadata> {
  const id = parseInt(params.id);
  const data = await getProjectsId(id, { populate: '*' });
  const project = data?.data?.attributes;

  if (!project) {
    return {};
  }

  return {
    title: `Impact4Soil - ${project?.name}`,
  };
}

export default async function ProjectDetails({ params }: ProjectDetailsProps) {
  const id = parseInt(params.id);
  const data = await getProjectsId(id, { populate: '*' });
  const project = data?.data?.attributes;

  if (!project) {
    notFound();
  }

  const { name, website } = project;

  const fields: Field[] = getProjectFields(project);

  return (
    <>
      <div className="mb-6 mt-10 text-[34px] leading-[50px]">{name}</div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} type="project" />
        ))}
      </div>
      <div className="mt-10 flex justify-end gap-4">
        <Button disabled variant="secondary">
          <Pencil className="mr-2 h-6 w-6" />
          Suggest changes
        </Button>
        <Button asChild variant="secondary">
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

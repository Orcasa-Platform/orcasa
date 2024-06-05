import { notFound } from 'next/navigation';

import { Metadata } from 'next';

import ExternalLink from '/public/images/external-link.svg';
import NotepadText from '/public/images/notepad-text.svg';
import Tractor from '/public/images/tractor.svg';

import { getPractices, getPracticesId } from '@/types/generated/practice';

import { Button } from '@/components/ui/button';

import Field from './field';
import { getPracticeFields, getPracticeImplementationFields } from './parsers';

interface PracticeDetailsProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PracticeDetailsProps): Promise<Metadata> {
  const id = parseInt(params.id);
  const data = await getPracticesId(id);
  const practice = data?.data?.attributes;

  // If we couldn't find the practice, we don't return any metadata
  if (!practice) {
    return {};
  }

  return {
    title: `Impact4Soil - ${practice?.title}`,
    description: practice?.short_description,
  };
}

export default async function PracticeDetails({ params }: PracticeDetailsProps) {
  const id = parseInt(params.id);
  const data = await getPractices({
    filters: { id },
    populate: {
      countries: { fields: ['name', 'id'] },
      land_use_types: { fields: ['name', 'id'] },
      land_use_priors: { fields: ['name', 'id'] },
      subinterventions: { fields: ['name', 'id'] },
      projects: { filters: { publication_status: 'accepted' }, fields: ['name', 'id'] },
      organizations: { filters: { publication_status: 'accepted' }, fields: ['name', 'id'] },
    },
  });
  const practiceList = data?.data || [];
  const practice = practiceList[0]?.attributes;

  // If we couldn't find the practice, we display a 404
  if (!practice) {
    notFound();
  }

  const { title, practice_url: url } = practice;
  const fields = getPracticeFields(practice);
  const implementationFields = getPracticeImplementationFields(practice);

  return (
    <div className="flex flex-col gap-10 text-white lg:flex-row lg:gap-16">
      <div className="flex flex-1 flex-col gap-2 lg:min-w-[50%] lg:gap-6">
        <h1 className="font-serif text-2xl lg:text-4xl">{title}</h1>
        <p className="leading-7 text-gray-200 max-lg:pb-4">{practice?.short_description}</p>
        <Button className="h-9 text-sm lg:w-fit" variant="outline-dark" asChild disabled={!url}>
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            {practice?.source_name}
          </a>
        </Button>
      </div>
      <div className="flex flex-col gap-10 lg:basis-2/3 lg:gap-16">
        <div className="flex flex-1 flex-col gap-6">
          <header className="flex gap-2 border-b border-gray-600 pb-1">
            <Tractor className="h-6 w-6" />
            <h2 className="mb-4 font-serif text-xl">Implementation</h2>
          </header>
          {implementationFields.map((field) => (
            <Field key={field.label} {...field} />
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-6">
          <header className="flex gap-2 border-b border-gray-600 pb-1">
            <NotepadText className="h-6 w-6" />
            <h2 className="mb-4 font-serif text-xl">Details</h2>
          </header>
          {fields.map((field) => (
            <Field key={field.label} {...field} />
          ))}
        </div>
      </div>
    </div>
  );
}

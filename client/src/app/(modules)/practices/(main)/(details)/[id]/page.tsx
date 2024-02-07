import { notFound } from 'next/navigation';

import { ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

import { getPracticesId } from '@/types/generated/practice';

import { Button } from '@/components/ui/button';

import Field from '../field';
import { getPracticeFields, getPracticeImplementationFields } from '../parsers';

interface PracticeDetailsProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PracticeDetailsProps): Promise<Metadata> {
  const id = parseInt(params.id);
  const data = await getPracticesId(id);
  const practice = data?.data?.attributes;

  // If we couldn't find the practice or it is not relevant, we don't return any metadata
  if (!practice || !practice.show) {
    return {};
  }

  return {
    title: `Impact4Soil - ${practice?.title}`,
  };
}

export default async function PracticeDetails({ params }: PracticeDetailsProps) {
  const id = parseInt(params.id);
  const data = await getPracticesId(id, { populate: '*' });
  const practice = data?.data?.attributes;

  // If we couldn't find the practice or it is not relevant, we display a 404
  if (!practice || !practice.show) {
    notFound();
  }

  const { title, practice_url: url } = practice;
  const fields = getPracticeFields(practice);
  const implementationFields = getPracticeImplementationFields(practice);
  return (
    <>
      <h1 className="mb-6 mt-10 font-serif text-3.8xl leading-[50px]">{title}</h1>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} />
        ))}
      </div>
      <h2 className="flex flex-col gap-4 border-t border-dashed border-t-gray-300 pt-10">
        <div className="mb-4 font-serif text-xl">Implementation</div>
        {implementationFields.map((field) => (
          <Field key={field.label} {...field} />
        ))}
      </h2>
      <div className="mt-10 flex justify-end gap-4">
        <Button asChild variant="secondary" disabled={!url}>
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-6 w-6" />
            Visit Source
          </a>
        </Button>
      </div>
    </>
  );
}

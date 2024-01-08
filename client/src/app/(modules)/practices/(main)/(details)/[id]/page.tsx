import { notFound } from 'next/navigation';

// import { ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

import { getPracticesId } from '@/types/generated/practice';

// import { Button } from '@/components/ui/button';

import Field from '../field';
import { getPracticeFields } from '../parsers';

interface PracticeDetailsProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PracticeDetailsProps): Promise<Metadata> {
  const id = parseInt(params.id);
  const data = await getPracticesId(id, { populate: '*' });
  const practice = data?.data?.attributes;
  if (!practice) {
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

  if (!practice) {
    notFound();
  }

  const { title } = practice;
  const fields: Field[] = getPracticeFields(practice);

  return (
    <>
      <div className="mb-6 mt-10 font-serif text-3.8xl leading-[50px]">{title}</div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} />
        ))}
      </div>
      {/* <div className="mt-10 flex justify-end gap-4">
        <Button asChild variant="secondary" disabled={!url}>
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-6 w-6" />
            Visit Website
          </a>
        </Button>
      </div> */}
    </>
  );
}

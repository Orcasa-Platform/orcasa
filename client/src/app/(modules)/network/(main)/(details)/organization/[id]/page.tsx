import { notFound } from 'next/navigation';

import { ExternalLink } from 'lucide-react';
import { Metadata } from 'next';

import { getOrganizationsId } from '@/types/generated/organization';

import NetworkDiagram from '@/components/network-diagram';
import { Button } from '@/components/ui/button';

import Field from '../../field';
import { getOrganizationFields } from '../../parsers';
import SuggestButton from '../../suggest-button';

interface OrganizationDetailsProps {
  params: { id: string };
}

export async function generateMetadata({ params }: OrganizationDetailsProps): Promise<Metadata> {
  const id = parseInt(params.id);
  const data = await getOrganizationsId(id, { populate: '*' });
  const organization = data?.data?.attributes;
  if (!organization || organization.publication_status !== 'accepted') {
    return {};
  }

  return {
    title: `Impact4Soil - ${organization?.name}`,
    description: organization?.short_description,
  };
}

export default async function OrganizationDetails({ params }: OrganizationDetailsProps) {
  const id = parseInt(params.id);
  const data = await getOrganizationsId(id, { populate: '*' });
  const organization = data?.data?.attributes;

  if (!organization || organization.publication_status !== 'accepted') {
    notFound();
  }

  const { name, url } = organization;

  const fields: Field[] = getOrganizationFields(organization);

  return (
    <>
      <div className="mb-6 mt-10 font-serif text-3.8xl leading-[50px]">{name}</div>
      <div className="flex flex-col gap-4">
        {fields.map((field) => (
          <Field key={field.label} {...field} type="organization" />
        ))}
      </div>
      <div className="mt-10 flex justify-end gap-4">
        <SuggestButton id={id} data={organization} label="organisation" />
        <Button asChild variant="secondary" disabled={!url}>
          <a href={url} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-6 w-6" />
            Visit Website
          </a>
        </Button>
      </div>
      <NetworkDiagram data={organization} id={id} type="organization" />
    </>
  );
}

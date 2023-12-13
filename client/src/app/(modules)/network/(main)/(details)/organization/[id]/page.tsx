import { notFound } from 'next/navigation';

import { ExternalLink, Pencil } from 'lucide-react';
import { Metadata } from 'next';

import env from '@/env.mjs';

import { getOrganizationsId } from '@/types/generated/organization';

import NetworkDiagram from '@/components/network-diagram';
import { Button } from '@/components/ui/button';

import Field from '../../field';
import { getOrganizationFields } from '../../parsers';

interface OrganizationDetailsProps {
  params: { id: string };
}

export async function generateMetadata({ params }: OrganizationDetailsProps): Promise<Metadata> {
  const id = parseInt(params.id);
  const data = await getOrganizationsId(id, { populate: '*' });
  const organization = data?.data?.attributes;
  if (!organization) {
    return {};
  }

  return {
    title: `Impact4Soil - ${organization?.name}`,
  };
}

export default async function OrganizationDetails({ params }: OrganizationDetailsProps) {
  const id = parseInt(params.id);
  const data = await getOrganizationsId(id, { populate: '*' });
  const organization = data?.data?.attributes;

  if (!organization) {
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
        <Button variant="secondary" asChild>
          <a
            href={`mailto:${
              env.NEXT_PUBLIC_NETWORK_SUGGESTION_EMAIL_RECIPIENTS
            }?subject=${encodeURIComponent(
              `Impact4Soil - Network - Change suggestion for organisation "${organization.name}", ID: ${id}`,
            )}&body=${encodeURIComponent(
              `Kindly provide comprehensive details below regarding the changes you'd like to suggest. Include your name, your affiliated organization, and an email address for potential contact. Thank you for assisting us in keeping the Soil Carbon Network up-to-date! Sincerely, The Impact4Soil Team.`,
            )}`}
          >
            <Pencil className="mr-2 h-6 w-6" />
            Suggest changes
          </a>
        </Button>
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

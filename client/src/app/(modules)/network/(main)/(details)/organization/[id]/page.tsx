import { notFound } from 'next/navigation';

import { Metadata } from 'next';
import ExternalLink from 'public/images/external-link.svg';

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

  const makeGlobalLink = (link: string) =>
    link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`;

  const { name, short_description, url } = organization;

  return (
    <>
      <h1 className="mb-6 mt-10 font-serif text-2xl leading-10 lg:text-3xl">{name}</h1>
      {!!short_description && (
        <p className="text-sm leading-7 text-gray-200">{short_description}</p>
      )}
      <div className="flex flex-col gap-4">
        {getOrganizationFields(organization, ['organization_type', 'country']).map((field) => (
          <Field key={field.label} {...field} type="organization" />
        ))}
      </div>
      <NetworkDiagram data={organization} id={id} type="organization" />
      <h2 className="font-serif text-xl">More details</h2>
      <div className="flex flex-col gap-4">
        {getOrganizationFields(organization, [
          'description',
          'main_organization_theme',
          'practices',
        ]).map((field) => (
          <Field key={field.label} {...field} type="organization" />
        ))}
      </div>
      <div className="flex justify-end gap-4 border-t border-gray-600 pt-6">
        <SuggestButton data={organization} label="organisation" />
        <Button asChild variant="outline-dark" size="sm" disabled={!url}>
          <a href={makeGlobalLink(url)} target="_blank" rel="noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit Website
          </a>
        </Button>
      </div>
    </>
  );
}

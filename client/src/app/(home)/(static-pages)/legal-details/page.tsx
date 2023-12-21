import { Metadata } from 'next';

import StaticPageContent from '@/components/home/static-page-content';

export default async function LegalDetails() {
  return <StaticPageContent slug="legal-details" />;
}

export const metadata: Metadata = {
  title: 'Impact4Soil - Legal Details',
  // TODO: update description
  description:
    'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil. Join the effort to combat climate change today.',
};

export const revalidate = 600;

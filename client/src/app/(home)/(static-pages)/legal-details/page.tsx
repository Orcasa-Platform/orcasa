import { Metadata } from 'next';

import StaticPageContent from '@/components/home/static-page-content';

export default async function LegalDetails() {
  return <StaticPageContent slug="legal-details" />;
}

export const metadata: Metadata = {
  title: 'Legal Details',
  description:
    'Powered by the Soil Carbon International Research Consortium, Impact4soil offers data and meta-analysis on soil carbon, practices, and land management solutions.',
};

export const revalidate = 0;

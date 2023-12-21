import { Metadata } from 'next';

import StaticPageContent from '@/components/home/static-page-content';

export default async function PersonalDataProtection() {
  return <StaticPageContent slug="personal-data-protection" />;
}

export const metadata: Metadata = {
  title: 'Impact4Soil - Personal data protection',
  // TODO: update description
  description:
    'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil. Join the effort to combat climate change today.',
};

import Script from 'next/script';

import { Metadata } from 'next';

import StaticPageContent from '@/components/home/static-page-content';

export default async function PersonalDataProtection() {
  return (
    <>
      <StaticPageContent slug="personal-data-protection" />
      <div id="matomo-opt-out" className="my-4 [&>*]:font-sans [&>input]:mr-2"></div>
      <Script src="https://matomo.cirad.fr/index.php?module=CoreAdminHome&action=optOutJS&divId=matomo-opt-out&language=en&fontSize=16px&showIntro=0" />
    </>
  );
}

export const metadata: Metadata = {
  title: 'Personal data protection',
  // TODO: update description
  description:
    'Learn about ORCaSa, a Horizon Europe initiative that unites international stakeholders to develop techniques for capturing and storing carbon in soil. Join the effort to combat climate change today.',
};

export const revalidate = 0;

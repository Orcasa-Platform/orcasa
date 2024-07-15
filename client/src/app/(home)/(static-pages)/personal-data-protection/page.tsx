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
  description:
    'Powered by the Soil Carbon International Research Consortium, Impact4soil offers data and meta-analysis on soil carbon, practices, and land management solutions.',
};

export const revalidate = 0;

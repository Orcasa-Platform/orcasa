'use client';

import Map from '/public/images/homepage-map.svg';

import { Drawer, DrawerTrigger } from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from '@/components/ui/tooltip';
import DatasetsIcon from '@/styles/icons/homepage-datasets.svg';
import GeospatialDataIcon from '@/styles/icons/homepage-geospatial-data.svg';
import NetworkIcon from '@/styles/icons/homepage-network.svg';
import PracticesIcon from '@/styles/icons/homepage-practices.svg';
import ScientificEvidenceIcon from '@/styles/icons/homepage-scientific-evidence.svg';

const modulesInfo = {
  'policy-makers': {
    tooltipText:
      'Explore concrete use cases and assess the impact of specific actions on the ground to shape effective policies and monitor activities related to soil health; identify research organizations who could provide with useful data, up to date methods, results, activities, and best practices to take informed decisions.',
  },
  'funding-agencies': {
    tooltipText:
      'Visualize what kind of projects are being funded to be able to promote cooperation and networking, and to identify funders from other countries to cooperate on new calls.',
  },
  researchers: {
    tooltipText:
      'Have a quick and easy access to the most relevant publications in the domain of soil carbon; visualize the impact/effect that different types of interventions/drivers have on soil carbon; see ongoing related projects.',
  },
  ngos: {
    tooltipText:
      'Access and share reliable data on soil carbon to support evidence-based decision-making, discover efficient practices to increase soil carbon, promote sustainable practices, and foster collaboration among stakeholders.',
  },
  companies: {
    tooltipText:
      'Visualize the location of experimental trials on soil carbon to identify areas where the effect of agricultural practices on carbon has been extensively studied and areas where it has not; add and edit information about relevant projects and stakeholders; discover efficient practices to increase soil carbon.',
  },
};

type HoverTooltipProps = {
  children: React.ReactNode;
  intro: React.ReactNode;
  slug: keyof typeof modulesInfo;
};

const HoverTooltip = ({ children, intro, slug }: HoverTooltipProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          // The props below makes sure that the tooltip is always centered on the trigger
          avoidCollisions={false}
          className="absolute -left-[153px] -top-[109px] z-50 flex h-[326px] w-[306px] cursor-pointer flex-col border-none bg-green-800 p-6 text-white zoom-in-100 data-[state=closed]:zoom-out-100"
        >
          <div className="flex flex-col gap-y-4">{intro}</div>
          <div className="mt-4 text-sm leading-normal">{modulesInfo[slug].tooltipText}</div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

const Card = ({
  title,
  slug,
  Icon,
}: {
  title: string;
  slug: keyof typeof modulesInfo;
  Icon: typeof GeospatialDataIcon;
}) => {
  const intro = (
    <>
      <Icon className="h-10 w-10 shrink-0" />
      <div className="text-left font-serif text-xl leading-[30px]">{title}</div>
    </>
  );

  const card = (
    <h3 className="flex h-32 w-[306px] flex-col gap-4 rounded-lg bg-green-700 p-6 text-white">
      {intro}
    </h3>
  );
  return (
    <>
      {/* All from lg */}
      <div className="hidden lg:block">
        <HoverTooltip intro={intro} slug={slug}>
          {card}
        </HoverTooltip>
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <Drawer>
          <DrawerTrigger>{card}</DrawerTrigger>
        </Drawer>
      </div>
    </>
  );
};

const ModulesSection = () => (
  <div id="modules" className="scroll-mt-[100px] px-4 lg:px-0">
    <div className="flex items-center justify-center pb-6 lg:mb-[120px]">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-center font-serif text-3xl font-semibold text-gray-700 lg:text-left lg:text-3.5xl">
            How can Impact4Soil benefit different users?
          </h2>
        </div>
      </div>
    </div>
    <div className="relative flex min-h-[916px] items-center justify-center lg:min-h-[616px]">
      <div className="absolute top-0">
        <Map className="w-[125%] lg:h-[616px] lg:w-full" />
      </div>
      <div className="absolute top-0 z-10 flex flex-col flex-wrap items-center pt-20 lg:h-[616px]">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:max-xl:gap-[46px] xl:gap-[72px]">
          <Card title="Policy makers" slug="policy-makers" Icon={GeospatialDataIcon} />
          <Card title="Funding agencies" slug="funding-agencies" Icon={ScientificEvidenceIcon} />
          <Card title="Researchers" Icon={NetworkIcon} slug="researchers" />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-10 lg:mt-36 lg:flex-row lg:max-xl:gap-[46px] xl:gap-24">
          <Card title="NGOs" slug="ngos" Icon={PracticesIcon} />
          <Card title="Companies" slug="companies" Icon={DatasetsIcon} />
        </div>
      </div>
    </div>
  </div>
);

export default ModulesSection;

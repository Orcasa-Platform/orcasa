'use client';

/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';

import { ArrowRight, CheckCircle } from 'lucide-react';
import Map from 'public/images/homepage-map.svg';

import { modules } from '@/constants/modules';

import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from '@/components/ui/tooltip';
import DatasetsIcon from '@/styles/icons/homepage-datasets.svg';
import GeospatialDataIcon from '@/styles/icons/homepage-geospatial-data.svg';
import NetworkIcon from '@/styles/icons/homepage-network.svg';
import PracticesIcon from '@/styles/icons/homepage-practices.svg';
import ScientificEvidenceIcon from '@/styles/icons/homepage-scientific-evidence.svg';

const modulesInfo = {
  'geospatial-data': {
    tooltipText:
      'Identify areas of interest for your research or interventions using global and local data on soil carbon from trusted sources: Soils Revealed, FAO, Soils Grids, Global Forest Watch, and others.',
    modalText: (
      <div className="text-base">
        Identify areas of interest for your research or interventions using global and local data on
        soil carbon from trusted sources: Soils Revealed, FAO, Soils Grids, Global Forest Watch, and
        others.
      </div>
    ),
    modalList: [
      'Soil carbon stock evolution',
      'Soil properties',
      'Annual carbon budget components',
      'Contextual data',
    ],
  },
  'scientific-evidence': {
    tooltipText:
      'Understand the impact of climate change, land use change, and land management practices on soil carbon based on a comprehensive global analysis of over 25 thousand peer-reviewed scientific papers from trusted sources, such as the Web of Science or Scopus.',
    modalText: (
      <>
        <div className="text-base">
          Understand the impact of climate change, land use change, and land management practices on
          soil carbon based on a comprehensive global analysis of over 25 thousand peer-reviewed
          scientific papers from trusted sources, such as the Web of Science or Scopus.
        </div>
        <div className="text-sm leading-7">
          The power of Scientific evidence is a semi-automated scraping, screening and
          characterization of published publications on soil carbon based on scientific standards,
          which makes it a reliable and real-time updated tool.
        </div>
      </>
    ),
    modalList: [
      '13 146 primary publications',
      '217 meta-analyses publications',
      'Quickly identify relevant scientific publications',
      "Measure global practices' impact with data-driven graphs",
    ],
  },
  network: {
    tooltipText:
      'Find synergies and promote cooperation between heterogeneous actors and initiatives within the soil carbon field.',
    modalText: (
      <>
        <div className="text-base">
          Find synergies and promote cooperation between heterogeneous actors and initiatives within
          the soil carbon field.
        </div>
        <div className="text-sm leading-7">
          The current network was created during the foundations of the Soil Carbon International
          Research Consortium. Help us extend it by suggesting new initiatives and organizations to
          be added.
        </div>
      </>
    ),
    modalList: [
      'Worldwide network',
      'Research, Universities, Private Sector, Public and Private Funders, Policymakers, Environmental Agencies, NGOs and more',
      'Discover potential partners',
      'Become part of the network',
    ],
  },
  practices: {
    tooltipText:
      'Have a real view of concrete land-management practices that generate a positive impact on soil carbon.',
    modalText: (
      <>
        <div className="text-base">
          Have a real view of concrete land-management practices that generate a positive impact on
          soil carbon.
        </div>
        <div className="text-sm leading-7">
          From the outputs of the comprehensive global analysis of Scientific evidence, Impact4Soil
          will question and select the most relevant existing practices related to soil carbon.
        </div>
      </>
    ),
    modalList: [
      'Trusted sources such as WOCAT',
      'Ground-level practices',
      'Classification by land use type and location',
    ],
  },
  datasets: {
    tooltipText:
      'Explore datasets on Soil Organic carbon from diverse trusted sources to find the correct information for your activities.',
    modalText: (
      <div className="text-base">
        Explore datasets on Soil Organic carbon from diverse trusted sources to find the correct
        information for your activities.
      </div>
    ),
    modalList: [
      'High quality, consolidated and open-access data',
      'Harvard Dataverse, CIRAD Dataverse, INRAE Dataverse, Joint Research Centre Data Catalogue and ZENODO',
      'Strengthen your activities',
    ],
  },
};

type Slug = keyof typeof modulesInfo;

type HoverTooltipProps = {
  children: React.ReactNode;
  intro: React.ReactNode;
  slug: Slug;
};

const HoverTooltip = ({ children, intro, slug }: HoverTooltipProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          // The props below makes sure that the tooltip is always centered on the trigger
          avoidCollisions={false}
          className="absolute -left-[153px] -top-[109px] z-50 flex h-[346px] w-[306px] cursor-pointer flex-col border-none bg-green-800 p-6 text-white zoom-in-100 data-[state=closed]:zoom-out-100"
        >
          <div className="flex flex-col gap-y-4">{intro}</div>
          <div className="mt-4 text-sm leading-normal">{modulesInfo[slug].tooltipText}</div>
          <div className="mt-auto flex items-center self-end whitespace-nowrap">
            Learn more
            <Button size="icon-sm" aria-hidden tabIndex={-1} className="ml-2 bg-gray-700">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
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
  slug: Slug;
  Icon: typeof GeospatialDataIcon;
}) => {
  const intro = (
    <>
      <Icon className="h-10 w-10 shrink-0" />
      <div className="text-left font-serif text-xl leading-[30px]">{title}</div>
    </>
  );

  const cardModule = modules.find((module) => module.slug === slug);
  const content = (
    <div className="flex h-full max-h-[90vh] w-full flex-col justify-between overflow-auto lg:flex-row">
      <div className="h-full flex-1 space-y-6 p-10 pb-2 lg:w-1/2 lg:pb-10">
        <Icon className="currentColor h-fit w-[48px] min-w-[48px]" />
        <div className="font-serif text-2xl leading-10">{title}</div>
        <div className="flex flex-col gap-6">{modulesInfo[slug].modalText}</div>
      </div>
      <div className="flex h-full flex-1 flex-col justify-between border-l border-dashed border-gray-700 border-opacity-50 p-10 pt-4 lg:w-1/2 lg:pt-[160px]">
        <ul className="flex flex-col gap-6 pb-6 lg:pb-0">
          {modulesInfo[slug].modalList.map((listElement) => (
            <li key={listElement} className="flex gap-2 text-sm">
              <CheckCircle className="h-4 w-4 min-w-fit" />
              {listElement}
            </li>
          ))}
        </ul>
        <Button variant="outline" asChild>
          <Link href={cardModule?.href ?? '#'}>
            Go to {cardModule?.name}
            <ArrowRight className="ml-4" />
          </Link>
        </Button>
      </div>
    </div>
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
        <Dialog>
          <DialogTrigger>
            <HoverTooltip intro={intro} slug={slug}>
              {card}
            </HoverTooltip>
          </DialogTrigger>
          <DialogContent
            onCloseAutoFocus={(e) => e.preventDefault()}
            contentClassName="p-0"
            className="!w-[792px] !max-w-[792px]"
          >
            {content}
          </DialogContent>
        </Dialog>
      </div>
      {/* Mobile */}
      <div className="block lg:hidden">
        <Drawer>
          <DrawerTrigger>{card}</DrawerTrigger>
          <DrawerContent>{content}</DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

const ModulesSection = () => (
  <div id="modules" className="scroll-mt-[100px] px-4 lg:px-0">
    <div className="flex items-center justify-center pb-6 lg:mb-[120px]">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center font-serif text-sm uppercase leading-[14px] tracking-wider text-gray-400">
          5 modules for climate impact
        </div>
        <div className="flex flex-col items-center gap-8">
          <h2 className="text-center font-serif text-3xl font-semibold text-gray-700 lg:text-left lg:text-3.5xl">
            What can Impact4Soil do for me?
          </h2>
          <div className="h-2 w-20 rounded-lg bg-yellow-500" />
          <div className="text-center leading-7 text-gray-500 lg:w-[600px] lg:leading-normal">
            Impact4Soil is a unique, reliable and inter-institutional knowledge platform that brings
            together the soil carbon community.
            <br />
            It is a source of key information and the latest research findings and results,
            including methodologies for soil carbon balance monitoring, practices, networks, and
            datasets.
          </div>
        </div>
      </div>
    </div>
    <div className="relative flex min-h-[916px] items-center justify-center lg:min-h-[616px]">
      <div className="absolute top-0">
        <Map className="w-[125%] lg:h-[616px] lg:w-full" />
      </div>
      <div className="absolute top-0 z-10 flex flex-col flex-wrap items-center pt-20 lg:h-[616px]">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:max-xl:gap-[46px] xl:gap-[72px]">
          <Card title="Geospatial data" slug="geospatial-data" Icon={GeospatialDataIcon} />
          <Card
            title="Scientific evidence"
            slug="scientific-evidence"
            Icon={ScientificEvidenceIcon}
          />
          <Card title="Network" Icon={NetworkIcon} slug="network" />
        </div>
        <div className="mt-10 flex flex-col items-center justify-center gap-10 lg:mt-36 lg:flex-row lg:max-xl:gap-[46px] xl:gap-24">
          <Card title="Practices" slug="practices" Icon={PracticesIcon} />
          <Card title="Datasets" slug="datasets" Icon={DatasetsIcon} />
        </div>
      </div>
    </div>
  </div>
);

export default ModulesSection;

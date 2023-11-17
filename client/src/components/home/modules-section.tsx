'use client';

/* eslint-disable @next/next/no-img-element */
import { Globe2, BarChart, Users2, FileSpreadsheet, ArrowRight, CheckCircle } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from '@/components/ui/tooltip';

// Module '"lucide-react"' has no exported member 'Tractor'
import Tractor from '@/styles/icons/tractor.svg';

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
        <div className="text-sm">
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
      'Measure global practices&apos; impact with data-driven graphs',
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
        <div className="text-sm">
          The current network was created during the foundations of the Soil Carbon International
          Research Consortium. Help us extend it by suggesting new projects and organizations to be
          added.
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
        <div className="text-sm">
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
  colorClass: string;
};

const HoverTooltip = ({ children, intro, slug, colorClass }: HoverTooltipProps) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent
          // The props below makes sure that the tooltip is always centered on the trigger
          avoidCollisions={false}
          className={cn(
            'absolute -left-[162.5px] -top-[63px] z-50 flex h-[292px] w-[325px]  cursor-pointer flex-col gap-4 p-6',
            colorClass,
          )}
        >
          {intro}
          <div className="text-sm leading-normal text-gray-700 ">
            {modulesInfo[slug].tooltipText}
          </div>
          <div className="mt-auto flex items-center justify-end">
            Learn more
            <ArrowRight className="ml-6" />
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
  bgColorClass,
  textColorClass,
}: {
  title: string;
  slug: Slug;
  Icon: typeof Globe2;
  bgColorClass: string;
  textColorClass: string;
}) => {
  const intro = (
    <>
      <Icon className="min-h-6 min-w-6 h-6 w-6" />
      <div className="text-left font-serif text-2xl text-gray-700">{title}</div>
    </>
  );

  return (
    <Dialog>
      <DialogTrigger>
        <HoverTooltip colorClass={bgColorClass} intro={intro} slug={slug}>
          <h3 className={cn('flex h-40 w-[245px] flex-col gap-4 p-6', bgColorClass)}>{intro}</h3>
        </HoverTooltip>
      </DialogTrigger>
      <DialogContent
        onCloseAutoFocus={(e) => e.preventDefault()}
        contentClassName="p-0"
        className="!w-[792px] !max-w-[792px]"
      >
        <div className="flex h-full w-full justify-between">
          <div className="h-full w-1/2 flex-1 space-y-6 p-10">
            <Icon className={cn('currentColor h-fit w-[48px] min-w-[48px]', textColorClass)} />
            <div className="font-serif text-2xl leading-10">{title}</div>
            <div className="flex flex-col gap-4">{modulesInfo[slug].modalText}</div>
          </div>
          <div className="flex h-full w-1/2 flex-1 border-l border-dashed border-gray-700 border-opacity-50 p-10 pt-[160px]">
            <ul className="flex flex-col gap-4">
              {modulesInfo[slug].modalList.map((listElement) => (
                <li key={listElement} className="flex gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 min-w-fit" />
                  {listElement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ModulesSection = () => (
  <div id="modules" className="scroll-mt-[100px]">
    <div className="mb-[120px] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center font-serif text-sm uppercase leading-[14px] tracking-wider text-gray-400">
          5 modules for climate impact
        </div>
        <div className="flex flex-col items-center gap-8">
          <h2 className="font-serif text-[32px] font-semibold text-gray-700">
            What can Impact4Soil do for me?
          </h2>
          <div className="h-2 w-20 bg-teal-500" />
          <div className="w-[600px] text-center text-gray-700">
            Impact4Soil is a unique, reliable and inter-institutional knowledge platform that brings
            altogether actors and experts of the soil carbon community.
            <br />
            It provides key information on the latest researches and their results, including
            methodologies for soil carbon balance monitoring, practices, networks, and data.
          </div>
        </div>
      </div>
    </div>
    <div className="relative flex min-h-[616px] items-center justify-center">
      <div className="absolute top-0">
        <img src="/images/map.png" className="h-[616px] w-full" alt="" />
      </div>
      <div className="absolute top-0 z-10 flex h-[616px] flex-col justify-center">
        <div className="flex gap-24">
          <Card
            title="Geospatial Data"
            slug="geospatial-data"
            Icon={Globe2}
            bgColorClass="bg-yellow-500"
            textColorClass="text-yellow-500"
          />
          <Card
            title="Scientific Evidence"
            slug="scientific-evidence"
            Icon={BarChart}
            bgColorClass="bg-green-700"
            textColorClass="text-green-700"
          />
          <Card
            title="Network"
            Icon={Users2}
            slug="network"
            bgColorClass="bg-blue-500"
            textColorClass="text-blue-500"
          />
        </div>
        <div className="mt-24 flex justify-center gap-24">
          <Card
            title="Practices"
            slug="practices"
            Icon={Tractor}
            bgColorClass="bg-brown-500"
            textColorClass="text-brown-500"
          />
          <Card
            title="Datasets"
            slug="datasets"
            Icon={FileSpreadsheet}
            bgColorClass="bg-purple-700"
            textColorClass="text-purple-700"
          />
        </div>
      </div>
    </div>
  </div>
);

export default ModulesSection;

'use client';

/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

import { Globe2, BarChart, Users2, FileSpreadsheet, ArrowRight, CheckCircle } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipPortal } from '@/components/ui/tooltip';

// Module '"lucide-react"' has no exported member 'Tractor'
import Tractor from '@/styles/icons/tractor.svg';

const modulesInfo = {
  'geospatial-data': {
    tooltipText:
      'Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut imperdiet arcu pellentesque.',
    modalText: (
      <>
        <div className="text-base">
          Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in
          adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut
          imperdiet arcu pellentesque.
        </div>
        <div className="text-sm">
          Lorem ipsum dolor sit amet consectetur. Proin id massa consequat cursus nulla pharetra.
          Adipiscing non lobortis risus quam feugiat feugiat. Suspendisse proin donec turpis augue
          non congue neque nec amet. Interdum blandit lacus vivamus amet cursus. Eget nisl est
          feugiat sit. Leo a lectus sagittis id dolor amet vitae orci massa. Nunc id congue lacus
          molestie vel. Ullamcorper risus fermentum curabitur consequat arcu convallis. Eget velit
          purus auctor adipiscing nulla lacinia semper hendrerit sociis.
        </div>
      </>
    ),
    modalList: [
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
    ],
  },
  'scientific-evidence': {
    tooltipText:
      'Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut imperdiet arcu pellentesque.',
    modalText: (
      <>
        <div className="text-base">
          Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in
          adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut
          imperdiet arcu pellentesque.
        </div>
        <div className="text-sm">
          Lorem ipsum dolor sit amet consectetur. Proin id massa consequat cursus nulla pharetra.
          Adipiscing non lobortis risus quam feugiat feugiat. Suspendisse proin donec turpis augue
          non congue neque nec amet. Interdum blandit lacus vivamus amet cursus. Eget nisl est
          feugiat sit. Leo a lectus sagittis id dolor amet vitae orci massa. Nunc id congue lacus
          molestie vel. Ullamcorper risus fermentum curabitur consequat arcu convallis. Eget velit
          purus auctor adipiscing nulla lacinia semper hendrerit sociis.
        </div>
      </>
    ),
    modalList: [
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
    ],
  },
  network: {
    tooltipText:
      'Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut imperdiet arcu pellentesque.',
    modalText: (
      <>
        <div className="text-base">
          Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in
          adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut
          imperdiet arcu pellentesque.
        </div>
        <div className="text-sm">
          Lorem ipsum dolor sit amet consectetur. Proin id massa consequat cursus nulla pharetra.
          Adipiscing non lobortis risus quam feugiat feugiat. Suspendisse proin donec turpis augue
          non congue neque nec amet. Interdum blandit lacus vivamus amet cursus. Eget nisl est
          feugiat sit. Leo a lectus sagittis id dolor amet vitae orci massa. Nunc id congue lacus
          molestie vel. Ullamcorper risus fermentum curabitur consequat arcu convallis. Eget velit
          purus auctor adipiscing nulla lacinia semper hendrerit sociis.
        </div>
      </>
    ),
    modalList: [
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
    ],
  },
  practices: {
    tooltipText:
      'Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut imperdiet arcu pellentesque.',
    modalText: (
      <>
        <div className="text-base">
          Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in
          adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut
          imperdiet arcu pellentesque.
        </div>
        <div className="text-sm">
          Lorem ipsum dolor sit amet consectetur. Proin id massa consequat cursus nulla pharetra.
          Adipiscing non lobortis risus quam feugiat feugiat. Suspendisse proin donec turpis augue
          non congue neque nec amet. Interdum blandit lacus vivamus amet cursus. Eget nisl est
          feugiat sit. Leo a lectus sagittis id dolor amet vitae orci massa. Nunc id congue lacus
          molestie vel. Ullamcorper risus fermentum curabitur consequat arcu convallis. Eget velit
          purus auctor adipiscing nulla lacinia semper hendrerit sociis.
        </div>
      </>
    ),
    modalList: [
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
    ],
  },
  datasets: {
    tooltipText:
      'Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut imperdiet arcu pellentesque.',
    modalText: (
      <>
        <div className="text-base">
          Lorem ipsum dolor sit amet consectetur. Sit blandit a mauris varius id. In leo in
          adipiscing in. Aliquet fringilla tortor faucibus elementum. Iaculis consequat et turpis ut
          imperdiet arcu pellentesque.
        </div>
        <div className="text-sm">
          Lorem ipsum dolor sit amet consectetur. Proin id massa consequat cursus nulla pharetra.
          Adipiscing non lobortis risus quam feugiat feugiat. Suspendisse proin donec turpis augue
          non congue neque nec amet. Interdum blandit lacus vivamus amet cursus. Eget nisl est
          feugiat sit. Leo a lectus sagittis id dolor amet vitae orci massa. Nunc id congue lacus
          molestie vel. Ullamcorper risus fermentum curabitur consequat arcu convallis. Eget velit
          purus auctor adipiscing nulla lacinia semper hendrerit sociis.
        </div>
      </>
    ),
    modalList: [
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
      'Lorem Ipsum ...',
    ],
  },
};

type Slug = keyof typeof modulesInfo;

type HoverTooltipProps = {
  children: React.ReactNode;
  tooltipOpen: boolean;
  setTooltipOpen: (open: boolean) => void;
  intro: React.ReactNode;
  slug: Slug;
  colorClass: string;
};

const HoverTooltip = ({
  children,
  tooltipOpen,
  setTooltipOpen,
  intro,
  slug,
  colorClass,
}: HoverTooltipProps) => {
  return (
    <div onMouseEnter={() => setTooltipOpen(true)} onMouseLeave={() => setTooltipOpen(false)}>
      <Tooltip open={tooltipOpen}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent
            className={cn(
              'absolute -left-[162.5px] -top-[63px] z-50 flex h-[292px] w-[325px]  cursor-pointer flex-col gap-4 p-6',
              colorClass,
            )}
          >
            {intro}
            <div className=" text-sm leading-normal text-gray-700">
              {modulesInfo[slug].tooltipText}
            </div>
            <div className="mt-auto flex items-center justify-end">
              Learn more
              <ArrowRight className="ml-6" />
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </div>
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
  const [tooltipOpen, setTooltipOpen] = useState<boolean>(false);
  const intro = (
    <>
      <Icon className="min-h-6 min-w-6 h-6 w-6" />
      <div className="text-left font-serif text-2xl text-gray-700">{title}</div>
    </>
  );

  return (
    <Dialog>
      <DialogTrigger>
        <HoverTooltip
          tooltipOpen={tooltipOpen}
          setTooltipOpen={setTooltipOpen}
          colorClass={bgColorClass}
          intro={intro}
          slug={slug}
        >
          <div className={cn('flex h-40 w-[245px] flex-col gap-4 p-6', bgColorClass)}>{intro}</div>
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
                  <CheckCircle />
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
          <div className="font-serif text-[32px] font-semibold text-gray-700">
            What can Impact4Soil do for me?
          </div>
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

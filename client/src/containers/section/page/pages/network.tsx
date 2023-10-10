import { useState } from 'react';

import { capitalize } from 'lodash';
import { Filter, Plus } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useNetworks } from '@/hooks/networks';

import NetworkDetailPanel from '@/containers/section/page/networks/network-detail-panel';
import NetworkList from '@/containers/section/page/networks/network-list';

import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

const AddButton = ({ text }: { text: string }) => (
  <Button
    onClick={() => {
      // TODO - add elements
    }}
  >
    <Plus className="mr-2 h-6 w-6" />
    <div className="text-base">{text}</div>
  </Button>
);
const FilterButton = ({ text }: { text: string }) => (
  <Button
    onClick={() => {
      // TODO - add elements
    }}
  >
    <Filter className="mr-2 h-6 w-6" />
    <div className="text-base">{text}</div>
  </Button>
);
const CategoryButton = ({ category, count }: { category: string; count: number }) => (
  <Button
    className={cn('gap-1 text-base font-semibold', {
      'bg-sky-700  hover:bg-sky-700/80': category === 'projects',
      'bg-blue-400 hover:bg-blue-400/80': category === 'organisations',
    })}
    variant="button-switch"
    onClick={() => {
      // TODO - add elements
    }}
  >
    <span>{capitalize(category)}</span>
    <span className="font-normal">({count})</span>
  </Button>
);

export type OpenDetails = {
  id: number;
  type: 'project' | 'organization';
} | null;

const NetworkPage = () => {
  const page = 1;
  const { count, ...networksResponse } = useNetworks({ page });
  const [networkOpened, setNetworkOpened] = useState<OpenDetails>(null);
  const networkPanelOpened =
    (networkOpened &&
      networksResponse?.networks?.find(
        (n) => n.id === networkOpened.id && n.type === networkOpened.type,
      )) ||
    null;
  const setOpenDetails = (details: OpenDetails) =>
    details ? setNetworkOpened(details) : setNetworkOpened(null);

  return (
    <>
      <NetworkDetailPanel
        data={networkPanelOpened}
        type={networkOpened?.type}
        setOpenDetails={setOpenDetails}
      />
      <h1 className="max-w-[372px] border-l-4 border-blue-500 pl-5 font-serif text-lg leading-7">
        Discover <span className="font-semibold text-blue-500">who does what</span> on soils carbon.
      </h1>
      <Search
        onChange={() => {
          // TODO - search
        }}
      />
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <CategoryButton category="organisations" count={count.organizations} />
          <CategoryButton category="projects" count={count.projects} />
        </div>
        <FilterButton text="More filters" />
      </div>
      <NetworkList {...networksResponse} setOpenDetails={setOpenDetails} />
      <div className="flex items-center justify-between">
        <div className="font-serif text-xl font-semibold leading-[30px]">
          Help us building the soil-carbon network
        </div>
        <div className="space-x-4">
          <AddButton text="Add organisation" />
          <AddButton text="Add project" />
        </div>
      </div>
    </>
  );
};

export default NetworkPage;

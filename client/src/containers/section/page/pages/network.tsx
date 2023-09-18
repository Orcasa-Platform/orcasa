import { capitalize } from 'lodash';
import { Filter, Plus } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useNetworks } from '@/hooks/networks';

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

const NetworkPage = () => {
  const page = 1;
  const { count, ...networksResponse } = useNetworks({ page });
  return (
    <>
      <h1 className="font-serif text-3.5xl">
        Discover <span className="font-semibold">who does what</span> on soils carbon.
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
      <NetworkList {...networksResponse} />
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

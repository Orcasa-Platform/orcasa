import { Plus } from 'lucide-react';

import NetworkList from '@/containers/section/page/networks/network-list';

import { Button } from '@/components/ui/button';
import { Search } from '@/components/ui/search';

const NetworkPage = () => {
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
      <NetworkList />
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold leading-[30px]">
          Help us building the soil-carbon network
        </div>
        <div className=" space-x-4">
          <AddButton text="Add organisation" />
          <AddButton text="Add project" />
        </div>
      </div>
    </>
  );
};

export default NetworkPage;

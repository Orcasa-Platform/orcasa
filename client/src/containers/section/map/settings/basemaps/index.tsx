import { BASEMAPS } from '@/constants/basemaps';

import BasemapItem from './item';

const Basemaps = () => {
  return (
    <ul className="grid grid-flow-col gap-4">
      {BASEMAPS.map((b) => (
        <li className="col-span-6" key={b.value}>
          <BasemapItem {...b} />
        </li>
      ))}
    </ul>
  );
};

export default Basemaps;

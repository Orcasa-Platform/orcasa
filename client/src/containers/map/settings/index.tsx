import Basemaps from './basemaps';
import Boundaries from './boundaries';
import Labels from './labels';

const MapSettings = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="font-serif text-xl">Map settings</h1>
      <Basemaps />
      <Labels />
      <Boundaries />
    </div>
  );
};

export default MapSettings;

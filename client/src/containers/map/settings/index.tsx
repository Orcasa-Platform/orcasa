import Basemaps from './basemaps';
import Labels from './labels';

const MapSettings = () => {
  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="font-serif text-xl">Map settings</h1>
      <Basemaps />
      <Labels />
    </div>
  );
};

export default MapSettings;

import Basemaps from './basemaps';
import Labels from './labels';

const MapSettings = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <h1 className="font-serif text-2xl">Map settings</h1>

      <Basemaps />

      <div className="border-t border-dashed border-gray-200 pt-2">
        <Labels />
      </div>
    </div>
  );
};

export default MapSettings;

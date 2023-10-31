import Basemaps from './basemaps';
import Labels from './labels';

const MapSettings = () => {
  return (
    <div className="space-y-3">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="h-6 font-serif font-semibold">Map style</h2>
      </div>
      <div className="space-y-6">
        <Basemaps />

        <div className="grid grid-flow-col gap-4 pt-5">
          <div className="col-span-6">
            <Labels />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSettings;
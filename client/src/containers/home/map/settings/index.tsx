import Basemaps from './basemaps';
import Labels from './labels';

const MapSettings = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-display text-lg">Map settings</h3>

      <div className="space-y-3 divide-y">
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

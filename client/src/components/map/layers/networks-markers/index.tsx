import { Marker } from 'react-map-gl/maplibre';

import { cn } from '@/lib/classnames';

import { LayerProps } from '@/types/layers';

import { useMapNetworks } from '@/hooks/networks';

export type NetworksLayerProps = LayerProps & {
  beforeId?: string;
};

const sizes = {
  '1-10': 'h-[40px] w-[20px]',
  '10-50': 'h-[60px] w-[40px]',
  '50-100': 'h-[80px] w-[60px]',
  '>100': 'h-[100px] w-[80px]',
};

const getSize = (size: number) => {
  if (size < 10) {
    return sizes['1-10'];
  }
  if (size < 50) {
    return sizes['10-50'];
  }
  if (size < 100) {
    return sizes['50-100'];
  }
  return sizes['>100'];
};

const NetworksMarkers = () => {
  const { data, isError, isFetched } = useMapNetworks();
  if (!data || (isFetched && isError)) {
    return null;
  }

  return Object.entries(data).map(([countryKey, networks]) => {
    if (!networks || (networks.length === 0 && typeof networks === 'undefined')) {
      return null;
    }
    const organizations = networks?.filter((network) => network?.type === 'organization');
    const projects = networks?.filter((network) => network?.type === 'project');

    return (
      <Marker
        key={`marker-${countryKey}`}
        longitude={networks[0]?.countryLong}
        latitude={networks[0]?.countryLat}
      >
        <div className="flex items-center gap-px">
          {organizations.length > 0 && (
            <div
              className={cn(
                'flex origin-left items-center justify-center border-2 border-black bg-blue-500',
                getSize(organizations?.length),
              )}
            >
              <div className="text-sm text-white">{organizations?.length}</div>
            </div>
          )}
          {projects.length > 0 && (
            <div
              className={cn(
                'flex origin-left items-center justify-center border-2 border-black bg-peach-700',
                getSize(projects?.length),
              )}
            >
              <div className="text-sm text-white">{projects?.length}</div>
            </div>
          )}
        </div>
      </Marker>
    );
  });
};

export default NetworksMarkers;

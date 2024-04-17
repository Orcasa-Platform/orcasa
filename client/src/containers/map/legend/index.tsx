import { useCallback, useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/classnames';

import { useLayersSettings, useLayers, DEFAULT_SETTINGS } from '@/store';

import MapLegendItem from '@/containers/map/legend/item';

import Legend from '@/components/map/legend';

import NetworkLegend from './network-legend';
import PracticesLegend from './practices-legend';

const MapLegends = ({ className = '', isMobile }: { className?: string; isMobile?: boolean }) => {
  const [layers, setLayers] = useLayers();
  const [layersSettings, setLayersSettings] = useLayersSettings();
  const pathname = usePathname();
  const isNetworkPage = pathname?.includes('network');
  const isPracticesPage = pathname?.includes('practice');

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      const newLayers: number[] = order.reduce((prev: number[], curr) => {
        const id = layers.find((layer) => layer === Number(curr));
        return !!id ? [...prev, id] : prev;
      }, []);

      setLayers(newLayers);
    },
    [layers, setLayers],
  );

  const handleChangeOpacity = useCallback(
    (id: number, opacity: number) =>
      setLayersSettings((prev) => ({
        ...prev,
        [id]: {
          ...DEFAULT_SETTINGS,
          ...prev[id],
          opacity,
        },
      })),
    [setLayersSettings],
  );

  const handleChangeVisibility = useCallback(
    (id: number, visibility: boolean) =>
      setLayersSettings((prev) => ({
        ...prev,
        [id]: {
          ...DEFAULT_SETTINGS,
          ...prev[id],
          visibility,
        },
      })),
    [setLayersSettings],
  );

  const handleRemove = useCallback(
    (id: number) => {
      const newSettings = { ...layersSettings };
      delete newSettings[id];
      setLayersSettings(newSettings);
      setLayers(layers.filter((layerId) => layerId !== id));
    },
    [layers, layersSettings, setLayers, setLayersSettings],
  );

  const sortable = !isMobile && layers?.length > 1;
  const getPosition = (i: number, totalNumber: number) => {
    if (totalNumber === 1) {
      return 'only';
    }
    if (i === 0) {
      return 'first';
    }
    if (i === totalNumber - 1) {
      return 'last';
    }
    return 'middle';
  };

  const ITEMS = useMemo(() => {
    if (isNetworkPage) {
      return <NetworkLegend />;
    }
    if (isPracticesPage) {
      return <PracticesLegend />;
    }

    return layers.map((layer, i) => {
      const settings = layersSettings[layer] ?? { opacity: 1, visibility: true };

      return (
        <MapLegendItem
          id={layer}
          key={layer}
          position={getPosition(i, layers.length)}
          settings={settings}
          onChangeOpacity={(opacity: number) => {
            handleChangeOpacity(layer, opacity);
          }}
          onChangeVisibility={(visibility: boolean) => {
            handleChangeVisibility(layer, visibility);
          }}
          onRemove={() => {
            handleRemove(layer);
          }}
          sortable={{
            enabled: sortable,
            handle: sortable,
          }}
        />
      );
    });
  }, [
    layers,
    layersSettings,
    sortable,
    handleChangeOpacity,
    handleChangeVisibility,
    handleRemove,
    isNetworkPage,
    isPracticesPage,
  ]);

  return (
    <div
      className={cn(
        !isMobile &&
          'absolute bottom-9 right-6 z-10 hidden max-w-xs lg:block min-[1810px]:bottom-8',
        {
          'w-full': !isPracticesPage && !isNetworkPage,
        },
      )}
    >
      <Legend
        className={cn(
          'max-h-[calc(100vh_-_theme(space.16)_-_theme(space.6)_-_theme(space.48))]',
          className,
        )}
        sortable={{
          enabled: sortable,
          handle: true,
        }}
        hideToggle={isMobile || isPracticesPage || isNetworkPage}
        onChangeOrder={handleChangeOrder}
      >
        {ITEMS}
      </Legend>
    </div>
  );
};

export default MapLegends;

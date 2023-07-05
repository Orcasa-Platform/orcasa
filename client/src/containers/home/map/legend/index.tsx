import { useCallback, useMemo } from 'react';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { cn } from '@/lib/classnames';

import { layersSettingsAtom, layersAtom, DEFAULT_SETTINGS } from '@/store';

import MapLegendItem from '@/containers/home/map/legend/item';

import Legend from '@/components/map/legend';

const MapLegends = ({ className = '' }) => {
  const layers = useRecoilValue(layersAtom);
  const setLayers = useSetRecoilState(layersAtom);
  const layersSettings = useRecoilValue(layersSettingsAtom);
  const setLayersSettings = useSetRecoilState(layersSettingsAtom);

  const handleChangeOrder = useCallback(
    (order: string[]) => {
      const newLayers: number[] = order.reduce((prev: number[], curr) => {
        const id = layers.find((layer) => layer === Number(curr));
        return !!id ? [...prev, id] : prev;
      }, []);

      setLayers(newLayers);
    },
    [layers, setLayers]
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
    [setLayersSettings]
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
    [setLayersSettings]
  );

  const handleChangeExpand = useCallback(
    (id: number, expand: boolean) =>
      setLayersSettings((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          expand,
        },
      })),
    [setLayersSettings]
  );

  const sortable = layers?.length > 1;

  const ITEMS = useMemo(() => {
    return layers.map((layer) => {
      const settings = layersSettings[layer] ?? { opacity: 1, visibility: true, expand: true };

      return (
        <MapLegendItem
          id={layer}
          key={layer}
          settings={settings}
          onChangeOpacity={(opacity: number) => {
            handleChangeOpacity(layer, opacity);
          }}
          onChangeVisibility={(visibility: boolean) => {
            handleChangeVisibility(layer, visibility);
          }}
          onChangeExpand={(expand: boolean) => {
            handleChangeExpand(layer, expand);
          }}
          sortable={{
            enabled: sortable,
            handle: layers.length > 1,
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
    handleChangeExpand,
  ]);

  return (
    <div className="absolute bottom-16 right-6 z-10 w-full max-w-xs">
      <Legend
        className={cn(
          'max-h-[calc(100vh_-_theme(space.16)_-_theme(space.6)_-_theme(space.48))]',
          className
        )}
        sortable={{
          enabled: sortable,
          handle: true,
        }}
        onChangeOrder={handleChangeOrder}
      >
        {ITEMS}
      </Legend>
    </div>
  );
};

export default MapLegends;

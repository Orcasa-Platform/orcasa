import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useMap } from 'react-map-gl';

import type { Feature } from 'geojson';
import { useRecoilValue } from 'recoil';

import { format } from '@/lib/utils/formats';

import { layersInteractiveIdsAtom, popupAtom } from '@/store';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerTyped } from '@/types/layers';

import ContentLoader from '@/components/ui/loader';

export interface PopupItemProps {
  id: number;
}
const PopupItem = ({ id }: PopupItemProps) => {
  const [rendered, setRendered] = useState(false);
  const DATA_REF = useRef<Feature['properties'] | undefined>();

  const { default: map } = useMap();

  const popup = useRecoilValue(popupAtom);
  const layersInteractiveIds = useRecoilValue(layersInteractiveIdsAtom);

  const { data, isFetching, isFetched, isError, isPlaceholderData } = useGetLayersId(id);

  const attributes = data?.data?.attributes as LayerTyped;
  const source = attributes.config.source;
  const click = attributes.interaction_config.events.find((ev) => ev.type === 'click');

  const DATA = useMemo(() => {
    if (source.type === 'vector' && rendered && popup && map) {
      const point = map.project(popup.lngLat);

      // check if the point is outside the canvas
      if (
        point.x < 0 ||
        point.x > map.getCanvas().width ||
        point.y < 0 ||
        point.y > map.getCanvas().height
      ) {
        return DATA_REF.current;
      }
      const query = map.queryRenderedFeatures(point, {
        layers: layersInteractiveIds,
      });

      const d = query.find((d) => {
        return d.source === source.id;
      })?.properties;

      DATA_REF.current = d;

      if (d) {
        return DATA_REF.current;
      }
    }

    return DATA_REF.current;
  }, [popup, source, layersInteractiveIds, map, rendered]);

  // handle renderer
  const handleMapRender = useCallback(() => {
    setRendered(!!map?.loaded() && !!map?.areTilesLoaded());
  }, [map]);

  useEffect(() => {
    map?.on('render', handleMapRender);

    return () => {
      map?.off('render', handleMapRender);
    };
  }, [map, handleMapRender]);

  return (
    <div className="p-4">
      <div className="space-y-3">
        <h3 className="text-base font-semibold">{attributes.title}</h3>

        <ContentLoader
          data={data?.data}
          isFetching={isFetching || (!rendered && !DATA_REF.current)}
          isFetched={isFetched && (rendered || !!DATA_REF.current)}
          isError={isError}
          isPlaceholderData={isPlaceholderData}
          skeletonClassName="h-20 w-[250px]"
        >
          <dl className="space-y-2">
            {click &&
              !!DATA &&
              click.values.map((v) => {
                return (
                  <div key={v.key}>
                    <dt className="text-xs font-semibold uppercase">{v.label || v.key}:</dt>
                    <dd className="text-sm">
                      {format({
                        id: v.format?.id,
                        value: DATA[v.key],
                        options: v.format?.options,
                      })}
                    </dd>
                  </div>
                );
              })}
            {click && !DATA && <div className="text-xs">No data</div>}
          </dl>
        </ContentLoader>
      </div>
    </div>
  );
};

export default PopupItem;

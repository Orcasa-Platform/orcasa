import { useCallback, useEffect, useRef, useState } from 'react';

import type { Feature } from 'geojson';
import type { GeoJsonProperties } from 'geojson';
import { useMap } from 'react-map-gl/maplibre';

import { format } from '@/lib/utils/formats';

import { useLayersInteractiveIds, usePopup } from '@/store';

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

  const [popup] = usePopup();
  const [layersInteractiveIds] = useLayersInteractiveIds();

  const { data, isFetching, isFetched, isError, isPlaceholderData } = useGetLayersId(id, {
    populate: 'metadata',
  });

  const [featuresData, setfeaturesData] = useState<GeoJsonProperties | undefined>();
  const attributes = data?.data?.attributes as LayerTyped;
  const source = attributes.config.source;
  const click = attributes.interaction_config.events.find((ev) => ev.type === 'click');
  const fetchLayer = attributes.interaction_config?.layer?.trim();
  const url = attributes.interaction_config?.url?.trim();

  useEffect(() => {
    const fetchData = async () => {
      if (!rendered || !popup || !map) return;
      if (['raster', 'vector'].includes(source.type)) {
        const point = map.project(popup.lngLat);
        // check if the point is outside the canvas
        if (
          point.x < 0 ||
          point.x > map.getCanvas().width ||
          point.y < 0 ||
          point.y > map.getCanvas().height
        ) {
          setfeaturesData(DATA_REF.current);
          return;
        }
      }
      if (source.type === 'raster') {
        const point = map.project(popup.lngLat);
        const bounds = map.getBounds();
        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        const width = map.getContainer().clientWidth;
        const height = map.getContainer().clientHeight;
        const x = Math.round(point.x);
        const y = Math.round(point.y);
        const response = await fetch(
          // Projection should be included in the url: ?crs=EPSG:4326
          `${url}&request=GetFeatureInfo&transparent=true&format=image/png&exceptions=application/vnd.ogc.se_xml&styles=&feature_count=10&service=WMS&version=1.1.1&layers=${fetchLayer}&QUERY_LAYERS=${fetchLayer}&x=${x}&y=${y}&bbox=${bbox}&width=${width}&height=${height}&info_format=application/json
          `,
        );
        const featureCollection = await response.json();
        const d = featureCollection?.features?.[0]?.properties;
        DATA_REF.current = d;

        setfeaturesData(DATA_REF.current);
        return;
      } else if (source.type === 'vector') {
        const point = map.project(popup.lngLat);
        const query = map.queryRenderedFeatures(point, {
          layers: layersInteractiveIds.map((id) => id.toString()),
        });

        const d = query.find((d) => {
          return d.source === source.id;
        })?.properties;

        DATA_REF.current = d;

        if (d) {
          setfeaturesData(DATA_REF.current);
        }
      }
    };

    fetchData();
  }, [popup, source, layersInteractiveIds, map, rendered, fetchLayer, url]);

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
        <h2 className="text-base font-semibold">{attributes.title}</h2>

        <ContentLoader
          data={data?.data}
          isFetching={isFetching || (!rendered && !DATA_REF.current)}
          isFetched={isFetched && (rendered || !!DATA_REF.current)}
          isError={isError}
          isPlaceholderData={isPlaceholderData}
          skeletonClassName="h-20 w-[250px]"
        >
          <div>
            <span className="font-semibold">Coordinates:</span> {popup?.lngLat.lng.toFixed(4)},{' '}
            {popup?.lngLat.lat.toFixed(4)}
          </div>
          <dl className="space-y-2">
            {click &&
              !!featuresData &&
              click.values.map((v) => {
                return (
                  <div key={v.key}>
                    <dt className="text-xs font-semibold uppercase">{v.label || v.key}:</dt>
                    <dd className="text-sm">
                      {format({
                        id: v.format?.id,
                        value: featuresData[v.key],
                        options: v.format?.options,
                      })}
                    </dd>
                  </div>
                );
              })}
            {click && !featuresData && <div className="text-xs">No data</div>}
          </dl>
        </ContentLoader>
      </div>
    </div>
  );
};

export default PopupItem;

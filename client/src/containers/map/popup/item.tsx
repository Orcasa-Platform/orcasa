import { useCallback, useEffect, useRef, useState } from 'react';

import type { Feature } from 'geojson';
import type { GeoJsonProperties } from 'geojson';
import { useMap } from 'react-map-gl/maplibre';

import { parseConfig, JSON_CONFIGURATION } from '@/lib/json-converter';
import { format } from '@/lib/utils/formats';

import { useLayersSettings } from '@/store';
import { useLayersInteractiveIds, usePopup } from '@/store';

import { useGetLayersId } from '@/types/generated/layer';
import { InteractionConfig, LayerTyped } from '@/types/layers';

import ContentLoader from '@/components/ui/loader';

export interface PopupItemProps {
  id: number;
  setPopup: ReturnType<typeof usePopup>[1];
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
  const [layersSettings] = useLayersSettings();

  const [featuresData, setfeaturesData] = useState<GeoJsonProperties | undefined>();
  const attributes = data?.data?.attributes as LayerTyped;
  const source = attributes.config.source;
  const layerSettings = layersSettings[id];
  const { params_config, interaction_config } = attributes;

  const parsedInteractionConfig = parseConfig<InteractionConfig | null>({
    config: interaction_config,
    params_config,
    settings: layerSettings || {},
    jsonConfiguration: JSON_CONFIGURATION,
  });

  const click =
    parsedInteractionConfig?.events.find((ev) => ev.type === 'click') ||
    attributes.interaction_config.events.find((ev) => ev.type === 'click');
  const url = parsedInteractionConfig?.url?.trim() || attributes.interaction_config?.url?.trim();
  const bboxAPI = parsedInteractionConfig?.bboxAPI;

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

        const bboxAPIs = {
          // Nominatim API bbox is in the format: south,north,west,east
          nominatim: `${bounds.getSouth()},${bounds.getNorth()},${bounds.getWest()},${bounds.getEast()}`,
          // Overpass API bbox is in the format: south,west,north,east (Used for maps.isric.org/mapserv server for example)
          overpass: `${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()}`,
          default: `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`,
        };

        const bbox = bboxAPIs[bboxAPI as keyof typeof bboxAPIs] || bboxAPIs.default;

        const width = map.getContainer().clientWidth;
        const height = map.getContainer().clientHeight;
        const x = Math.round(point.x);
        const y = Math.round(point.y);
        const replaceStrings: Record<string, string> = {
          '{x}': String(x),
          '{y}': String(y),
          '{width}': String(width),
          '{height}': String(height),
          '{bbox}': bbox,
        };
        const regexp = new RegExp(Object.keys(replaceStrings).join('|'), 'gi');

        const fetchURL = url?.replace(
          regexp,
          (matched) => replaceStrings[matched as keyof typeof replaceStrings],
        );

        if (!fetchURL) return;
        const response = await fetch(fetchURL);
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
  }, [popup, source, layersInteractiveIds, map, rendered, url, bboxAPI]);

  const handleMapRender = useCallback(() => {
    setRendered(!!map?.loaded() && !!map?.areTilesLoaded());
  }, [map]);

  useEffect(() => {
    map?.on('render', handleMapRender);

    return () => {
      map?.off('render', handleMapRender);
    };
  }, [map, handleMapRender]);
  const noData = <div>there is no data</div>;

  return (
    <div className="space-y-3 pt-2 text-gray-700 first:pt-0">
      <ContentLoader
        data={data?.data}
        isFetching={isFetching || (!rendered && !DATA_REF.current)}
        isFetched={isFetched && (rendered || !!DATA_REF.current)}
        isError={isError}
        isPlaceholderData={isPlaceholderData}
        skeletonClassName="h-20 w-[250px]"
      >
        {click && (
          <>
            <div className="text-base">
              At the Coordinates:{' '}
              <span className="font-semibold">
                {popup?.lngLat.lng.toFixed(4)}, {popup?.lngLat.lat.toFixed(4)}
              </span>
            </div>{' '}
            <dl className="flex items-center space-x-1 text-base">
              {click && !!featuresData && click.values.some((v) => featuresData[v.key]) && (
                <>
                  {click.values.map((v) => {
                    const value = format({
                      id: v.format?.id,
                      value: v.type === 'number' ? +featuresData[v.key] : featuresData[v.key],
                      options: v.format?.options,
                    });
                    if (!value) return noData;
                    return (
                      <div key={v.key}>
                        <dd>
                          <span>the value is </span>
                          <span className="font-semibold">
                            {value} {v.unit}
                          </span>
                        </dd>
                      </div>
                    );
                  })}
                </>
              )}
              {click && (!featuresData || Object.keys(featuresData).length === 0) && noData}
            </dl>
          </>
        )}
      </ContentLoader>
    </div>
  );
};

export default PopupItem;

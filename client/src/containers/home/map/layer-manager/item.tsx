'use client';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerResponseDataObject } from '@/types/generated/strapi.schemas';

import MapboxLayer, { MapboxLayerProps } from '@/components/map/layers/mapbox-layer';

const LayerManagerItem = ({
  id,
  beforeId,
}: Required<Pick<LayerResponseDataObject, 'id'>> & {
  beforeId: string;
}) => {
  const { data } = useGetLayersId(id);

  if (!data?.data?.attributes) return null;

  const { type } = data.data.attributes;

  if (type === 'mapbox') {
    const { config } = data.data.attributes;
    const c = config as Pick<MapboxLayerProps<Record<string, unknown>>, 'source' | 'styles'>;

    return (
      <MapboxLayer
        id={`${id}-layer`}
        beforeId={beforeId}
        source={c.source}
        styles={c.styles}
        settings={{
          opacity: 1,
          visibility: true,
        }}
      />
    );
  }
};

export default LayerManagerItem;

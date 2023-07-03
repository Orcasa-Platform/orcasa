import { useMemo } from 'react';

import { useRecoilValue } from 'recoil';

import { format } from '@/lib/utils/formats';

import { popupAtom } from '@/store';

import { useGetLayersId } from '@/types/generated/layer';
import { LayerTyped } from '@/types/layers';

import ContentLoader from '@/components/ui/loader';

export interface PopupItemProps {
  id: number;
}
const PopupItem = ({ id }: PopupItemProps) => {
  const popup = useRecoilValue(popupAtom);

  const { data, isFetching, isFetched, isError, isPlaceholderData } = useGetLayersId(id);

  const attributes = data?.data?.attributes as LayerTyped;
  const source = attributes.config.source;
  const click = attributes.interaction_config.events.find((ev) => ev.type === 'click');

  const DATA = useMemo(() => {
    if (source.type === 'vector') {
      const d = popup?.features?.find((d) => {
        return d.source === source?.id;
      })?.properties;

      if (d) {
        return d;
      }
    }

    return {};
  }, [popup, source]);

  return (
    <ContentLoader
      data={data?.data}
      isFetching={isFetching}
      isFetched={isFetched}
      isError={isError}
      isPlaceholderData={isPlaceholderData}
    >
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">{attributes.title}</h3>
        <dl className="space-y-2">
          {click &&
            click.values.map((v) => {
              return (
                <div key={v.key}>
                  <dt className="text-xs font-semibold uppercase underline">{v.label || v.key}:</dt>
                  <dd>
                    {format({
                      id: v.format?.id,
                      value: DATA[v.key],
                      options: v.format?.options,
                    })}
                  </dd>
                </div>
              );
            })}
        </dl>
      </div>
    </ContentLoader>
  );
};

export default PopupItem;

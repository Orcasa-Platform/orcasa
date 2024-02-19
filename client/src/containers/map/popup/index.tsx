import { X } from 'lucide-react';
import { Popup } from 'react-map-gl/maplibre';

import { useLayersInteractive, usePopup } from '@/store/index';

import PopupItem from '@/containers/map/popup/item';

import { Button } from '@/components/ui/button';

const PopupContainer = () => {
  const [popup, setPopup] = usePopup();
  const [layersInteractive] = useLayersInteractive();
  const lastLayerInteractiveId =
    layersInteractive?.length && layersInteractive[layersInteractive.length - 1];

  if (!popup) return null;

  return (
    <Popup
      latitude={popup.lngLat.lat}
      longitude={popup.lngLat.lng}
      closeOnClick={false}
      closeButton={false}
      className="z-50 flex w-[360px] flex-col font-serif"
      maxWidth="360px"
      onClose={() => setPopup(null)}
    >
      <div className="p-6 pr-[60px]">
        <Button
          size="icon"
          onClick={() => setPopup(null)}
          className="absolute right-0 top-0 flex items-center justify-center bg-slate-700 p-0 text-white transition-colors hover:bg-slate-500 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="space-y-2 divide-y divide-dashed divide-gray-300">
          {lastLayerInteractiveId && (
            <PopupItem
              key={lastLayerInteractiveId}
              id={lastLayerInteractiveId}
              setPopup={setPopup}
            />
          )}
        </div>
      </div>
    </Popup>
  );
};

export default PopupContainer;

import { Popup } from 'react-map-gl';

import Link from 'next/link';

import { X } from 'lucide-react';

import { cn } from '@/lib/classnames';

import { useMapSearchParams, useSidebarOpen } from '@/store';

import type { PracticesProperties } from '@/hooks/practices';

import { Button } from '@/components/ui/button';
export type PopupAttributes = {
  longitude: number;
  latitude: number;
  properties: {
    countryName: string;
    practices: PracticesProperties[];
  };
} | null;

type PracticesPopupProps = {
  popup: PopupAttributes;
  setPopup: (popup: PopupAttributes | null) => void;
};

const PracticesPopup = ({ popup, setPopup }: PracticesPopupProps) => {
  const searchParams = useMapSearchParams();
  const [, setSidebarOpen] = useSidebarOpen();
  if (!popup) return null;

  const {
    properties: { countryName, practices },
  } = popup;

  return (
    <Popup
      latitude={popup.latitude}
      longitude={popup.longitude}
      closeOnClick={false}
      closeButton={false}
      offset={20}
      maxWidth="332px"
      className="z-50 flex h-[332px] w-[332px] flex-col p-0 font-serif"
    >
      <div className="p-6">
        <Button
          type="button"
          size="icon-sm"
          variant="secondary"
          className="absolute right-6 top-4"
          onClick={() => setPopup(null)}
        >
          <span className="sr-only">Close</span>
          <X className="h-4 w-4 text-gray-500" />
        </Button>
        <header className="pb-6 pr-9 text-lg text-slate-700">
          <span>Practices in </span>
          <span className="font-semibold">{countryName}</span>
        </header>
        <div className="flex max-h-[232px] flex-col items-start justify-start gap-2 overflow-y-auto">
          {practices.map(({ id, title }) => (
            <Link
              key={id}
              className={cn('text-left text-base font-semibold text-green-700')}
              href={`/practices/${id}?${searchParams.toString()}`}
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              {title || '-'}
            </Link>
          ))}
        </div>
      </div>
    </Popup>
  );
};

export default PracticesPopup;
